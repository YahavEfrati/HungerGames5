import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@wolt_active_cart';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState('');
    const [minimumOrder, setMinimumOrder] = useState(0);
    const [tip, setTip] = useState(0);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load persisted cart on startup
    useEffect(() => {
        const loadCart = async () => {
            try {
                const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setCartItems(parsed.items || []);
                    setRestaurantId(parsed.restaurantId || null);
                    setRestaurantName(parsed.restaurantName || '');
                    setMinimumOrder(parsed.minimumOrder || 0);
                    setTip(parsed.tip || 0);
                }
            } catch (e) {
                console.error('Failed to load cart from storage:', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadCart();
    }, []);

    // Persist cart changes to AsyncStorage
    const persistCart = async (newItems, newRestId, newRestName, newMinOrder, newTip) => {
        try {
            const dataToSave = {
                items: newItems,
                restaurantId: newRestId,
                restaurantName: newRestName,
                minimumOrder: newMinOrder,
                tip: newTip,
            };
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Failed to save cart to storage:', e);
        }
    };

    /**
     * Calculates the subtotal price of all items in the cart.
     */
    const subtotal = cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity, 10) || 1;
        return sum + itemPrice * qty;
    }, 0);

    /**
     * Calculates the total quantity of items in the cart.
     */
    const itemCount = cartItems.reduce((sum, item) => {
        return sum + (parseInt(item.quantity, 10) || 1);
    }, 0);

    /**
     * Total price including subtotal and tip.
     */
    const total = subtotal + (parseFloat(tip) || 0);

    /**
     * Internal helper to insert or increment an item in the cart.
     */
    const performAddItem = (item, targetRestId, targetRestName, targetMinOrder) => {
        const itemId = item._id || item.id;
        const itemNotes = item.notes || '';
        const itemQuantity = parseInt(item.quantity, 10) || 1;

        let updatedItems;
        const existingIndex = cartItems.findIndex(
            (i) => (i._id === itemId || i.id === itemId) && (i.notes || '') === itemNotes
        );

        if (existingIndex >= 0) {
            updatedItems = [...cartItems];
            updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + itemQuantity,
            };
        } else {
            const newItem = {
                ...item,
                id: itemId,
                _id: itemId,
                quantity: itemQuantity,
                notes: itemNotes,
            };
            updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        setRestaurantId(targetRestId);
        setRestaurantName(targetRestName);
        setMinimumOrder(targetMinOrder);
        persistCart(updatedItems, targetRestId, targetRestName, targetMinOrder, tip);
    };

    /**
     * Adds an item to the cart, strictly enforcing single-restaurant constraint.
     * If user tries to add an item from a different restaurant, prompts to clear current cart.
     * 
     * @param {Object} item - Product item with quantity and notes.
     * @param {Object} restaurant - Restaurant object with id/_id, name, and minimumOrder.
     * @param {boolean} [forceClear=false] - Whether to clear the cart without prompt.
     * @returns {boolean} True if added or prompt shown, false if cancelled.
     */
    const addToCart = (item, restaurant, forceClear = false) => {
        const targetRestId = String(restaurant?._id || restaurant?.id || '');
        const targetRestName = restaurant?.name || 'this restaurant';
        const targetMinOrder = parseFloat(restaurant?.minimumOrder) || 0;

        // Check single restaurant conflict
        if (
            cartItems.length > 0 &&
            restaurantId &&
            String(restaurantId) !== targetRestId &&
            !forceClear
        ) {
            Alert.alert(
                'Clear Cart?',
                `Your cart currently contains items from ${restaurantName || 'another restaurant'}. Would you like to clear your cart and start a new order at ${targetRestName}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Clear & Add',
                        style: 'destructive',
                        onPress: () => {
                            const itemId = item._id || item.id;
                            const itemNotes = item.notes || '';
                            const itemQuantity = parseInt(item.quantity, 10) || 1;
                            const newItem = {
                                ...item,
                                id: itemId,
                                _id: itemId,
                                quantity: itemQuantity,
                                notes: itemNotes,
                            };
                            const newItems = [newItem];
                            setCartItems(newItems);
                            setRestaurantId(targetRestId);
                            setRestaurantName(targetRestName);
                            setMinimumOrder(targetMinOrder);
                            setTip(0);
                            persistCart(newItems, targetRestId, targetRestName, targetMinOrder, 0);
                        },
                    },
                ]
            );
            return false;
        }

        if (forceClear) {
            const itemId = item._id || item.id;
            const itemNotes = item.notes || '';
            const itemQuantity = parseInt(item.quantity, 10) || 1;
            const newItem = {
                ...item,
                id: itemId,
                _id: itemId,
                quantity: itemQuantity,
                notes: itemNotes,
            };
            const newItems = [newItem];
            setCartItems(newItems);
            setRestaurantId(targetRestId);
            setRestaurantName(targetRestName);
            setMinimumOrder(targetMinOrder);
            setTip(0);
            persistCart(newItems, targetRestId, targetRestName, targetMinOrder, 0);
            return true;
        }

        performAddItem(item, targetRestId, targetRestName, targetMinOrder);
        return true;
    };

    /**
     * Removes an item from the cart matching both item ID and notes.
     */
    const removeFromCart = (itemId, notes = '') => {
        const updatedItems = cartItems.filter(
            (i) => !((i._id === itemId || i.id === itemId) && (i.notes || '') === (notes || ''))
        );

        if (updatedItems.length === 0) {
            setCartItems([]);
            setRestaurantId(null);
            setRestaurantName('');
            setMinimumOrder(0);
            setTip(0);
            persistCart([], null, '', 0, 0);
        } else {
            setCartItems(updatedItems);
            persistCart(updatedItems, restaurantId, restaurantName, minimumOrder, tip);
        }
    };

    /**
     * Updates the quantity of a specific item in the cart.
     */
    const updateQuantity = (itemId, notes = '', newQuantity) => {
        const qty = parseInt(newQuantity, 10);
        if (isNaN(qty) || qty <= 0) {
            removeFromCart(itemId, notes);
            return;
        }

        const updatedItems = cartItems.map((item) => {
            if ((item._id === itemId || item.id === itemId) && (item.notes || '') === (notes || '')) {
                return { ...item, quantity: qty };
            }
            return item;
        });

        setCartItems(updatedItems);
        persistCart(updatedItems, restaurantId, restaurantName, minimumOrder, tip);
    };

    /**
     * Clears all items from the cart and resets state.
     */
    const clearCart = () => {
        setCartItems([]);
        setRestaurantId(null);
        setRestaurantName('');
        setMinimumOrder(0);
        setTip(0);
        persistCart([], null, '', 0, 0);
    };

    /**
     * Updates the tip amount.
     */
    const updateTip = (amount) => {
        const parsedTip = Math.max(0, parseFloat(amount) || 0);
        setTip(parsedTip);
        persistCart(cartItems, restaurantId, restaurantName, minimumOrder, parsedTip);
    };

    const openCartDrawer = () => setIsCartDrawerOpen(true);
    const closeCartDrawer = () => setIsCartDrawerOpen(false);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                restaurantId,
                restaurantName,
                minimumOrder,
                tip,
                subtotal,
                itemCount,
                total,
                isLoaded,
                isCartDrawerOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                setTip: updateTip,
                openCartDrawer,
                closeCartDrawer,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
