import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../constants/theme';
import { createEditModalStyles } from './EditOrderModal.styles';
import { getRestaurantProducts } from '../services/restaurantService';

export default function EditOrderModal({ visible, onClose, order, onSave }) {
    const { colors } = useTheme();
    const styles = createEditModalStyles(colors);

    const [addressX, setAddressX] = useState('0');
    const [addressY, setAddressY] = useState('0');
    const [tip, setTip] = useState('0');
    const [items, setItems] = useState([]);
    
    const [availableProducts, setAvailableProducts] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Sync order data and load products when modal opens
    useEffect(() => {
        if (order && visible) {
            setAddressX(order.addressX?.toString() || '0');
            setAddressY(order.addressY?.toString() || '0');
            setTip(order.tip?.toString() || '0');
            setError(null);
            
            // Load available products for this restaurant to resolve names/prices
            const loadProducts = async () => {
                try {
                    const prods = await getRestaurantProducts(order.restaurantId);
                    setAvailableProducts(prods);
                    
                    // Map items with names and prices
                    const mappedItems = order.items.map(item => {
                        const prod = prods.find(p => p._id === item.productId || p.id === item.productId);
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            name: prod ? prod.name : 'Unknown Item',
                            price: prod ? Number(prod.price) : 0
                        };
                    });
                    setItems(mappedItems);
                } catch (err) {
                    setError('Failed to load menu products.');
                }
            };
            loadProducts();
        }
    }, [order, visible]);

    const handleUpdateQty = (productId, delta) => {
        setItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0)); // Remove if quantity drops to 0
    };

    const handleSaveClick = async () => {
        const ax = parseFloat(addressX);
        const ay = parseFloat(addressY);
        const t = parseFloat(tip) || 0;

        if (isNaN(ax) || isNaN(ay)) {
            setError('Address coordinates must be valid numbers.');
            return;
        }

        if (items.length === 0) {
            setError('Order must contain at least one item.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            
            const updateData = {
                addressX: ax,
                addressY: ay,
                tip: t,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
            };

            await onSave(order._id, updateData);
            onClose(); // Close on success
        } catch (err) {
            setError(err.message || 'Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!order) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Pending Order</Text>
                    
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address Coordinate X</Text>
                            <TextInput 
                                style={styles.input}
                                value={addressX}
                                onChangeText={setAddressX}
                                keyboardType="numeric"
                                placeholderTextColor={colors.inputPlaceholder}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address Coordinate Y</Text>
                            <TextInput 
                                style={styles.input}
                                value={addressY}
                                onChangeText={setAddressY}
                                keyboardType="numeric"
                                placeholderTextColor={colors.inputPlaceholder}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Rider Tip (₪)</Text>
                            <TextInput 
                                style={styles.input}
                                value={tip}
                                onChangeText={setTip}
                                keyboardType="numeric"
                                placeholderTextColor={colors.inputPlaceholder}
                            />
                        </View>

                        <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>Adjust Ordered Items</Text>
                            {items.length === 0 && (
                                <Text style={styles.emptyItemsText}>All items removed.</Text>
                            )}
                            
                            {items.map(item => (
                                <View key={item.productId} style={styles.itemRow}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>₪{item.price.toFixed(2)} each</Text>
                                    </View>
                                    <View style={styles.qtyControls}>
                                        <TouchableOpacity 
                                            style={styles.qtyBtn}
                                            onPress={() => handleUpdateQty(item.productId, -1)}
                                        >
                                            <Text style={styles.qtyBtnText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                                        <TouchableOpacity 
                                            style={styles.qtyBtn}
                                            onPress={() => handleUpdateQty(item.productId, 1)}
                                        >
                                            <Text style={styles.qtyBtnText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={styles.cancelBtn} 
                            onPress={onClose}
                            disabled={isSaving}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.saveBtn} 
                            onPress={handleSaveClick}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color={colors.primaryText} />
                            ) : (
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
