import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { createCartStyles } from '../styles/cart.styles';
import CartItem from './CartItem';

/**
 * CartDrawer Component
 * Modal drawer presenting active cart items, quantity controls, and checkout CTA.
 */
export default function CartDrawer({ minimumOrder }) {
    const { colors } = useTheme();
    const styles = createCartStyles(colors);
    const router = useRouter();

    const {
        cartItems,
        restaurantName,
        subtotal,
        itemCount,
        isCartDrawerOpen,
        closeCartDrawer,
        updateQuantity,
        removeFromCart,
        clearCart,
        minimumOrder: contextMinimumOrder,
    } = useCart();

    const effectiveMinOrder = minimumOrder !== undefined ? minimumOrder : contextMinimumOrder;
    const minOrderAmount = parseFloat(effectiveMinOrder) || 0;
    const isBelowMin = minOrderAmount > 0 && subtotal < minOrderAmount;


    const handleClearPrompt = () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear your current order?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        clearCart();
                        closeCartDrawer();
                    },
                },
            ]
        );
    };

    const handleGoToCheckout = () => {
        if (isBelowMin) return;
        closeCartDrawer();
        router.push('/checkout');
    };

    return (
        <Modal
            visible={isCartDrawerOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={closeCartDrawer}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.drawerContainer}>
                    {/* Drawer Header */}
                    <View style={styles.drawerHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeCartDrawer}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        <View style={styles.drawerTitleContainer}>
                            <Text style={styles.drawerTitle}>Your order</Text>
                            {restaurantName ? (
                                <Text style={styles.drawerSubtitle} numberOfLines={1}>
                                    {restaurantName}
                                </Text>
                            ) : null}
                        </View>

                        {cartItems.length > 0 ? (
                            <TouchableOpacity
                                style={styles.clearCartButton}
                                onPress={handleClearPrompt}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.clearCartText}>Clear</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 36 }} />
                        )}
                    </View>

                    {/* Items List */}
                    <ScrollView
                        style={styles.itemsScroll}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {cartItems.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>🛒</Text>
                                <Text style={styles.emptyText}>Your cart is empty.</Text>
                            </View>
                        ) : (
                            cartItems.map((item, idx) => (
                                <CartItem
                                    key={`${item._id || item.id}-${item.notes || ''}-${idx}`}
                                    item={item}
                                    onUpdateQuantity={(itm, qty) =>
                                        updateQuantity(itm._id || itm.id, itm.notes, qty)
                                    }
                                    onRemove={(itm) =>
                                        removeFromCart(itm._id || itm.id, itm.notes)
                                    }
                                />
                            ))
                        )}
                    </ScrollView>

                    {/* Drawer Footer */}
                    {cartItems.length > 0 && (
                        <View style={styles.drawerFooter}>
                            {isBelowMin && (
                                <Text style={styles.minOrderWarning}>
                                    Add ₪{(minOrderAmount - subtotal).toFixed(2)} more to reach minimum order
                                </Text>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.checkoutButton,
                                    isBelowMin ? styles.checkoutButtonDisabled : null,
                                ]}
                                onPress={handleGoToCheckout}
                                disabled={isBelowMin}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.checkoutButtonPrice}>
                                    ₪{subtotal.toFixed(2)}
                                </Text>
                                <Text style={styles.checkoutButtonText}>
                                    Go to checkout
                                </Text>
                                <View style={styles.checkoutButtonBadge}>
                                    <Text style={styles.checkoutButtonBadgeText}>
                                        {itemCount}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}
