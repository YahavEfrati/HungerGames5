import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { createCartStyles } from '../styles/cart.styles';

/**
 * CartButton Component
 * Floating bottom bar displayed when there are items in the cart.
 */
export default function CartButton({ onPress }) {
    const { colors } = useTheme();
    const styles = createCartStyles(colors);
    const { itemCount, subtotal, openCartDrawer } = useCart();

    if (itemCount === 0) {
        return null;
    }

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            openCartDrawer();
        }
    };

    return (
        <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handlePress}
                activeOpacity={0.85}
            >
                <View style={styles.floatingButtonLeft}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{itemCount}</Text>
                    </View>
                    <Text style={styles.floatingButtonTitle}>View order</Text>
                </View>
                <Text style={styles.floatingButtonPrice}>₪{subtotal.toFixed(2)}</Text>
            </TouchableOpacity>
        </View>
    );
}
