import React from 'react';
import { View, Text } from 'react-native';

/**
 * OrderItemsSummaryCard Component (Body content for Items summary SectionCard)
 */
export default function OrderItemsSummaryCard({ cartItems, styles }) {
    return (
        <View>
            {cartItems.map((item, idx) => {
                const unitPrice = parseFloat(item.price) || 0;
                const qty = parseInt(item.quantity, 10) || 1;
                return (
                    <View
                        key={`${item._id || item.id}-${item.notes || ''}-${idx}`}
                        style={styles.summaryItemRow}
                    >
                        <View style={styles.summaryItemLeft}>
                            <View style={styles.summaryItemTitleRow}>
                                <View style={styles.summaryItemQtyBadge}>
                                    <Text style={styles.summaryItemQtyText}>{qty}x</Text>
                                </View>
                                <Text style={styles.summaryItemName} numberOfLines={1}>
                                    {item.name}
                                </Text>
                            </View>
                            {item.notes ? (
                                <Text style={styles.summaryItemNotes} numberOfLines={2}>
                                    Note: {item.notes}
                                </Text>
                            ) : null}
                        </View>
                        <Text style={styles.summaryItemPrice}>
                            ₪{(unitPrice * qty).toFixed(2)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}
