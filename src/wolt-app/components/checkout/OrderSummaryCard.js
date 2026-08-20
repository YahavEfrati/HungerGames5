import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

/**
 * OrderSummaryCard Component (Body content for Order Summary SectionCard)
 */
export default function OrderSummaryCard({
    subtotal,
    tip,
    total,
    isSubmitting,
    onPlaceOrder,
    colors,
    styles,
}) {
    return (
        <View>
            <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>₪{subtotal.toFixed(2)}</Text>
            </View>

            {tip > 0 && (
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Courier tip</Text>
                    <Text style={styles.priceValue}>₪{parseFloat(tip).toFixed(2)}</Text>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₪{total.toFixed(2)}</Text>
            </View>

            <Text style={styles.taxNote}>Includes taxes where applicable</Text>

            <TouchableOpacity
                style={[
                    styles.placeOrderButton,
                    isSubmitting ? styles.placeOrderButtonDisabled : null,
                ]}
                onPress={onPlaceOrder}
                disabled={isSubmitting}
                activeOpacity={0.85}
            >
                {isSubmitting ? (
                    <ActivityIndicator color={colors.primaryText} />
                ) : (
                    <Text style={styles.placeOrderButtonText}>
                        Place Order • ₪{total.toFixed(2)}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
