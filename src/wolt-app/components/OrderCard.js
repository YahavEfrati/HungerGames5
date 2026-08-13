import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../constants/theme';
import { createOrderCardStyles } from './OrderCard.styles';
import { getRestaurantById } from '../services/restaurantService';

/**
 * Component to display individual order details.
 * Supports Edit and Cancel actions if the order is "pending".
 * 
 * @param {Object} props - Component props
 * @param {Object} props.order - The order data object.
 * @param {Function} props.onCancel - Callback invoked when the user confirms cancellation.
 * @param {Function} props.onEdit - Callback invoked when the user clicks Edit.
 */
export default function OrderCard({ order, onCancel, onEdit }) {
    const { colors } = useTheme();
    const styles = createOrderCardStyles(colors);
    const [restaurantName, setRestaurantName] = useState('Loading...');

    // Fetch the restaurant metadata to resolve the restaurant name
    useEffect(() => {
        let isMounted = true;
        const fetchRestaurant = async () => {
            try {
                const rest = await getRestaurantById(order.restaurantId);
                if (isMounted && rest) {
                    setRestaurantName(rest.name);
                }
            } catch (err) {
                if (isMounted) setRestaurantName('Unknown Restaurant');
            }
        };
        fetchRestaurant();
        return () => { isMounted = false; };
    }, [order.restaurantId]);

    // Format the creation date
    const dateFormatted = new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString();
    
    // Status resolution and styling (Completely static)
    const statusLower = (order.status || 'pending').toLowerCase();
    const isPending = statusLower === 'pending';

    let statusColor = colors.textSecondary;
    let statusBg = colors.disabledBg;

    if (isPending || statusLower === 'active' || statusLower === 'accepted' || statusLower === 'in_progress') {
        statusColor = colors.primaryText;
        statusBg = colors.primary;
    } else if (statusLower === 'completed' || statusLower === 'delivered') {
        statusColor = colors.success;
        statusBg = colors.successBg;
    } else if (statusLower === 'cancelled') {
        statusColor = colors.error;
        statusBg = colors.errorBg;
    }

    const handleEdit = () => {
        if (onEdit) onEdit(order);
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                { 
                    text: 'Yes, Cancel', 
                    style: 'destructive',
                    onPress: () => onCancel(order._id)
                }
            ]
        );
    };

    const totalItems = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.restaurantName} numberOfLines={1}>{restaurantName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {order.status || 'Pending'}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{dateFormatted}</Text>
            </View>
            
            <View style={styles.detailsRow}>
                <Text style={styles.label}>Items</Text>
                <Text style={styles.value}>{totalItems} items</Text>
            </View>

            <View style={styles.detailsRow}>
                <Text style={styles.label}>Total Price</Text>
                <Text style={styles.value}>₪{order.totalPrice?.toFixed(2) || '0.00'}</Text>
            </View>

            {/* Conditionally render actions strictly for pending orders */}
            {isPending && (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
