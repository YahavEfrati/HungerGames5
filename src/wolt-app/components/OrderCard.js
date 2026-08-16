import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../constants/theme';
import { createOrderCardStyles } from '../styles/OrderCard.styles';
import { getRestaurantById, getRestaurantProducts } from '../services/restaurantService';

/**
 * Component to display individual order details.
 * Supports Edit and Cancel actions if the order is "pending".
 * The card is expandable to show specific items.
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
    const [products, setProducts] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Fetch the restaurant metadata to resolve the restaurant name and products
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                // Fetch the restaurant to display its name
                const rest = await getRestaurantById(order.restaurantId);
                if (isMounted && rest) {
                    setRestaurantName(rest.name);
                }
                
                // Fetch products to display names and prices in expanded view
                const prods = await getRestaurantProducts(order.restaurantId);
                if (isMounted && prods) {
                    setProducts(prods);
                }
            } catch (err) {
                if (isMounted) setRestaurantName('Unknown Restaurant');
            }
        };
        fetchData();
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
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => setIsExpanded(!isExpanded)}
        >
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

            {/* Expanded items list */}
            {isExpanded && (
                <View style={styles.expandedSection}>
                    <Text style={styles.expandedHeader}>Order Details</Text>
                    {order.items?.map((item, index) => {
                        const product = products.find(p => p._id === item.productId || p.id === item.productId);
                        const name = product ? product.name : 'Unknown Item';
                        const price = product ? product.price : 0;
                        const itemTotal = price * item.quantity;
                        
                        return (
                            <View key={index} style={styles.expandedItemRow}>
                                <Text style={styles.expandedItemQty}>{item.quantity}x</Text>
                                <Text style={styles.expandedItemName} numberOfLines={1}>{name}</Text>
                                <Text style={styles.expandedItemPrice}>₪{itemTotal.toFixed(2)}</Text>
                            </View>
                        );
                    })}
                </View>
            )}

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
        </TouchableOpacity>
    );
}
