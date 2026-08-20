import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * EmptyCartView Component
 * Displayed when user visits checkout with no active items in the cart.
 */
export default function EmptyCartView({ onBrowseRestaurants, styles }) {
    return (
        <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartIcon}>🛍️</Text>
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>
                Add dishes from a restaurant to proceed with checkout.
            </Text>
            <TouchableOpacity
                style={styles.returnHomeBtn}
                onPress={onBrowseRestaurants}
                activeOpacity={0.8}
            >
                <Text style={styles.returnHomeBtnText}>Browse Restaurants</Text>
            </TouchableOpacity>
        </View>
    );
}
