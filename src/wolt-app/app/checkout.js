import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { getToken, getUser } from '../services/authService';
import { createOrder } from '../services/orderService';
import { createCheckoutStyles } from '../styles/checkout.styles';

import SectionCard from '../components/common/SectionCard';
import EmptyCartView from '../components/checkout/EmptyCartView';
import DeliveryDetailsCard from '../components/checkout/DeliveryDetailsCard';
import OrderItemsSummaryCard from '../components/checkout/OrderItemsSummaryCard';
import CourierTipCard from '../components/checkout/CourierTipCard';
import OrderSummaryCard from '../components/checkout/OrderSummaryCard';

/**
 * Strips invalid characters from coordinate inputs, allowing only digits,
 * an optional single leading minus sign, and at most one decimal point.
 */
const sanitizeCoordinateInput = (val) => {
    if (!val) return '';
    let cleaned = val.replace(/[^0-9.-]/g, '');
    const isNegative = cleaned.startsWith('-');
    cleaned = cleaned.replace(/-/g, '');
    if (isNegative) cleaned = '-' + cleaned;
    
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
};

const validateLatitude = (val) => {
    if (!val || val === '-' || val === '.') return 'Latitude is required';
    const num = parseFloat(val);
    if (isNaN(num)) return 'Invalid number';
    if (num < -90 || num > 90) return 'Latitude must be between -90 and 90';
    return null;
};

const validateLongitude = (val) => {
    if (!val || val === '-' || val === '.') return 'Longitude is required';
    const num = parseFloat(val);
    if (isNaN(num)) return 'Invalid number';
    if (num < -180 || num > 180) return 'Longitude must be between -180 and 180';
    return null;
};

const formatCoordinate = (val, defaultVal = 0) => {
    const num = parseFloat(val);
    return isNaN(num) ? Number(defaultVal).toFixed(4) : num.toFixed(4);
};

/**
 * CheckoutScreen Component
 * Coordinates screen-level state, address coordinate editing, tip selector,
 * pre-order confirmation, and submission flow using reusable SectionCard containers.
 */
export default function CheckoutScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = createCheckoutStyles(colors);

    const {
        cartItems,
        restaurantId,
        restaurantName,
        subtotal,
        tip,
        setTip,
        total,
        clearCart,
    } = useCart();

    // Delivery Coordinates State
    const [deliveryX, setDeliveryX] = useState('32.0853');
    const [deliveryY, setDeliveryY] = useState('34.7818');
    const [coordErrors, setCoordErrors] = useState({ x: null, y: null });
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // Tip UI & Submission State
    const [isCustomTipMode, setIsCustomTipMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-populate delivery coordinates from logged-in user profile
    useEffect(() => {
        const loadInitialCoordinates = async () => {
            try {
                const storedUser = await getUser();
                if (storedUser) {
                    if (storedUser.addressX !== undefined && storedUser.addressX !== null) {
                        const cleanX = sanitizeCoordinateInput(String(storedUser.addressX));
                        if (!validateLatitude(cleanX)) setDeliveryX(cleanX);
                    }
                    if (storedUser.addressY !== undefined && storedUser.addressY !== null) {
                        const cleanY = sanitizeCoordinateInput(String(storedUser.addressY));
                        if (!validateLongitude(cleanY)) setDeliveryY(cleanY);
                    }
                }
            } catch (err) {
                console.error('Failed to load user address:', err);
            }
        };
        loadInitialCoordinates();
    }, []);

    // Empty Cart View
    if (cartItems.length === 0) {
        return (
            <EmptyCartView
                onBrowseRestaurants={() => router.replace('/')}
                styles={styles}
            />
        );
    }

    // Coordinate Handlers
    const handleLatitudeChange = (text) => {
        const cleaned = sanitizeCoordinateInput(text);
        setDeliveryX(cleaned);
        setCoordErrors((prev) => ({ ...prev, x: validateLatitude(cleaned) }));
    };

    const handleLongitudeChange = (text) => {
        const cleaned = sanitizeCoordinateInput(text);
        setDeliveryY(cleaned);
        setCoordErrors((prev) => ({ ...prev, y: validateLongitude(cleaned) }));
    };

    const handleConfirmAddress = () => {
        const errX = validateLatitude(deliveryX);
        const errY = validateLongitude(deliveryY);
        if (errX || errY) {
            setCoordErrors({ x: errX, y: errY });
            return;
        }
        setCoordErrors({ x: null, y: null });
        setIsEditingAddress(false);
    };

    // Tip Handlers
    const handleTipSelect = (val) => {
        setIsCustomTipMode(false);
        setTip(val);
    };

    const handleCustomTipChange = (text) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        setTip(Math.max(0, parseFloat(cleaned) || 0));
    };

    // Place Order Flow
    const handlePlaceOrder = async () => {
        const token = await getToken();
        const user = await getUser();
        if (!token || !user) {
            Alert.alert(
                'Login Required',
                'Please log in to your account to place your order.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Log In',
                        onPress: () =>
                            router.push({
                                pathname: '/login',
                                params: {
                                    from: '/checkout',
                                    relayMessage: 'Please log in to complete your order.',
                                },
                            }),
                    },
                ]
            );
            return;
        }

        const errX = validateLatitude(deliveryX);
        const errY = validateLongitude(deliveryY);
        if (errX || errY) {
            setCoordErrors({ x: errX, y: errY });
            setIsEditingAddress(true);
            Alert.alert('Invalid Delivery Coordinates', errX || errY);
            return;
        }

        const orderPayload = {
            restaurantId: String(restaurantId),
            addressX: parseFloat(deliveryX),
            addressY: parseFloat(deliveryY),
            tip: parseFloat(tip) || 0,
            items: cartItems.map((item) => ({
                productId: String(item._id || item.id),
                name: item.name,
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity, 10) || 1,
                notes: item.notes || '',
            })),
        };

        const submitOrder = async () => {
            setIsSubmitting(true);
            try {
                await createOrder(orderPayload);
                clearCart();
                router.replace('/orders');
            } catch (err) {
                Alert.alert('Order Failed', err.message || 'Could not place order. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        };

        // Pre-submission confirmation step
        Alert.alert(
            'Confirm Order',
            `Place order at ${restaurantName || 'this restaurant'} for ₪${total.toFixed(2)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm & Place Order',
                    style: 'default',
                    onPress: submitOrder,
                },
            ]
        );
    };

    const hasCoordinateErrors = Boolean(coordErrors.x || coordErrors.y);

    const deliveryRightAction = (
        <TouchableOpacity
            onPress={() => {
                if (isEditingAddress) {
                    handleConfirmAddress();
                } else {
                    setIsEditingAddress(true);
                }
            }}
            activeOpacity={0.7}
        >
            <Text style={styles.sectionActionText}>
                {isEditingAddress ? 'Done' : 'Change'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Hero Header */}
                <View style={styles.heroHeader}>
                    <View style={styles.navBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.screenTitle}>Checkout</Text>
                            <Text style={styles.restaurantSubtitle} numberOfLines={1}>
                                Ordering from {restaurantName || 'Restaurant'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Details Section */}
                <SectionCard
                    title="Delivery details"
                    rightAction={deliveryRightAction}
                    styles={styles}
                >
                    <DeliveryDetailsCard
                        deliveryX={deliveryX}
                        deliveryY={deliveryY}
                        formattedX={formatCoordinate(deliveryX, 32.0853)}
                        formattedY={formatCoordinate(deliveryY, 34.7818)}
                        coordErrors={coordErrors}
                        isEditingAddress={isEditingAddress}
                        hasCoordinateErrors={hasCoordinateErrors}
                        onLatitudeChange={handleLatitudeChange}
                        onLongitudeChange={handleLongitudeChange}
                        onConfirmAddress={handleConfirmAddress}
                        colors={colors}
                        styles={styles}
                    />
                </SectionCard>

                {/* Items Summary Section */}
                <SectionCard title="Items summary" styles={styles}>
                    <OrderItemsSummaryCard
                        cartItems={cartItems}
                        styles={styles}
                    />
                </SectionCard>

                {/* Tip for Courier Section */}
                <SectionCard title="Tip for the courier" styles={styles}>
                    <CourierTipCard
                        tip={tip}
                        isCustomTipMode={isCustomTipMode}
                        onTipSelect={handleTipSelect}
                        onEnableCustomTip={() => {
                            setIsCustomTipMode(true);
                            if (tip === 0) setTip(10);
                        }}
                        onCustomTipChange={handleCustomTipChange}
                        onIncrementTip={() => setTip(tip + 1)}
                        onDecrementTip={() => setTip(Math.max(0, tip - 1))}
                        styles={styles}
                    />
                </SectionCard>

                {/* Price Breakdown & Place Order Section */}
                <SectionCard title="Summary" styles={styles}>
                    <OrderSummaryCard
                        subtotal={subtotal}
                        tip={tip}
                        total={total}
                        isSubmitting={isSubmitting}
                        onPlaceOrder={handlePlaceOrder}
                        colors={colors}
                        styles={styles}
                    />
                </SectionCard>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
