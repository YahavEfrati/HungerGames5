import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { createCartStyles } from '../styles/cart.styles';

/**
 * CartItem Component
 * Displays a single cart item with name, notes, quantity controls, and price.
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    const { colors } = useTheme();
    const styles = createCartStyles(colors);

    const unitPrice = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity, 10) || 1;
    const itemTotal = unitPrice * quantity;

    return (
        <View style={styles.itemRow}>
            <View style={styles.itemMain}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    {item.notes ? (
                        <Text style={styles.itemNotes} numberOfLines={2}>
                            Note: {item.notes}
                        </Text>
                    ) : null}
                </View>
                <View>
                    <Text style={styles.itemPrice}>₪{itemTotal.toFixed(2)}</Text>
                    {quantity > 1 ? (
                        <Text style={styles.itemUnitPrice}>₪{unitPrice.toFixed(2)} each</Text>
                    ) : null}
                </View>
            </View>

            <View style={styles.itemControls}>
                <View style={styles.stepper}>
                    <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => onUpdateQuantity(item, quantity - 1)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.stepperButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperQuantity}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => onUpdateQuantity(item, quantity + 1)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemove(item)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
