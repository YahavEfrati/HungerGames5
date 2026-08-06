import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { getEntityId, sameEntityId } from '../utils/idUtils';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const userId = getEntityId(currentUser) || 'guest';
    const cartStorageKey = `wolt_cart_${userId}`;

    const prevUserIdRef = useRef('guest');

    // Initialize carts from localStorage or default to empty object
    const [carts, setCarts] = useState(() => {
        try {
            const saved = localStorage.getItem(cartStorageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    // When the user changes (login/logout), reload their specific cart or merge if transitioning from guest
    useEffect(() => {
        const prevUserId = prevUserIdRef.current;
        const currentUserId = getEntityId(currentUser) || 'guest';
        
        if (prevUserId === 'guest' && currentUserId !== 'guest') {
            // Transition from guest to authenticated user detected!
            // Attempt to merge the guest cart into the new user cart
            const guestCartKey = 'wolt_cart_guest';
            const userCartKey = `wolt_cart_${currentUserId}`;
            
            let guestCarts = {};
            try {
                guestCarts = JSON.parse(localStorage.getItem(guestCartKey)) || {};
            } catch (e) {}

            let userCarts = {};
            try {
                userCarts = JSON.parse(localStorage.getItem(userCartKey)) || {};
            } catch (e) {}

            let hasMerged = false;

            // Iterate over the guest cart items by restaurant
            for (const restId in guestCarts) {
                if (guestCarts[restId].length > 0) {
                    if (!userCarts[restId]) {
                        userCarts[restId] = [...guestCarts[restId]];
                        hasMerged = true;
                    } else {
                        // Merge items individually
                        guestCarts[restId].forEach(guestItem => {
                            const existingIndex = userCarts[restId].findIndex(i =>
                                sameEntityId(getEntityId(i), getEntityId(guestItem)) && i.notes === guestItem.notes
                            );
                            if (existingIndex >= 0) {
                                userCarts[restId][existingIndex].quantity += guestItem.quantity;
                            } else {
                                userCarts[restId].push(guestItem);
                            }
                        });
                        hasMerged = true;
                    }
                }
            }

            // Save the merged result
            if (hasMerged) {
                localStorage.setItem(userCartKey, JSON.stringify(userCarts));
            }
            
            // Clean up the guest cart
            localStorage.removeItem(guestCartKey);
            
            setCarts(userCarts);
        } else {
            // Standard load (initial load or logout)
            try {
                const saved = localStorage.getItem(`wolt_cart_${currentUserId}`);
                setCarts(saved ? JSON.parse(saved) : {});
            } catch (e) {
                setCarts({});
            }
        }

        prevUserIdRef.current = currentUserId;
    }, [currentUser]);

    // Helper to get cart items and calculate total for a specific restaurant
    const getCart = (restId) => {
        const items = carts[restId] || [];
        const total = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
        return { items, total };
    };

    const updateCarts = (updater) => {
        setCarts(prev => {
            const newCarts = typeof updater === 'function' ? updater(prev) : updater;
            localStorage.setItem(cartStorageKey, JSON.stringify(newCarts));
            return newCarts;
        });
    };

    const addItemToCart = (item, restId) => {
        updateCarts(prev => {
            const currentItems = prev[restId] || [];
            const itemId = getEntityId(item);
            const normalizedItem = {
                ...item,
                _id: itemId,
                id: itemId
            };
            
            // Check if item already exists with exact same notes
            const existingItemIndex = currentItems.findIndex(i =>
                sameEntityId(getEntityId(i), itemId) && i.notes === item.notes
            );
            let newItems;
            if (existingItemIndex >= 0) {
                newItems = [...currentItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + item.quantity
                };
            } else {
                newItems = [...currentItems, normalizedItem];
            }
            
            return {
                ...prev,
                [restId]: newItems
            };
        });
    };

    const removeItemFromCart = (itemId, notes, restId) => {
        updateCarts(prev => {
            const currentItems = prev[restId] || [];
            const newItems = currentItems.filter(i =>
                !(sameEntityId(getEntityId(i), itemId) && i.notes === notes)
            );
            
            // If the cart is now empty, we can choose to delete the key or leave it as an empty array
            if (newItems.length === 0) {
                const newCarts = { ...prev };
                delete newCarts[restId];
                return newCarts;
            }
            
            return {
                ...prev,
                [restId]: newItems
            };
        });
    };

    const updateItemQuantity = (itemId, notes, newQuantity, restId) => {
        if (newQuantity <= 0) {
            removeItemFromCart(itemId, notes, restId);
            return;
        }
        updateCarts(prev => {
            const currentItems = prev[restId] || [];
            const newItems = [...currentItems];
            const itemIndex = newItems.findIndex(i =>
                sameEntityId(getEntityId(i), itemId) && i.notes === notes
            );
            if (itemIndex >= 0) {
                newItems[itemIndex] = {
                    ...newItems[itemIndex],
                    quantity: newQuantity
                };
            }
            return {
                ...prev,
                [restId]: newItems
            };
        });
    };

    const clearCart = (restId) => {
        updateCarts(prev => {
            const newCarts = { ...prev };
            delete newCarts[restId];
            return newCarts;
        });
    };

    return (
        <CartContext.Provider value={{
            carts,
            getCart,
            addItemToCart,
            removeItemFromCart,
            updateItemQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
