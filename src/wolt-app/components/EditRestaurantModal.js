import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/theme';
import RestaurantFormFields from './RestaurantFormFields';
import { updateRestaurant, deleteRestaurant } from '../services/restaurantService';
import { createStyles } from '../styles/restaurantModal.styles';

/**
 * Modal component for Restaurant Updating (PATCH) and Deleting.
 * Replicates functionality and validation of web EditRestaurantModal.jsx for mobile.
 */
export default function EditRestaurantModal({ visible, onClose, restaurant, onRestaurantUpdated }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        addressX: '',
        addressY: '',
        kosher: false,
        working_hours: '',
        categories: [],
        image: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (restaurant && visible) {
            setFormData({
                name: restaurant.name || '',
                description: restaurant.description || '',
                phone: restaurant.phone || '',
                addressX: restaurant.addressX !== undefined ? String(restaurant.addressX) : '',
                addressY: restaurant.addressY !== undefined ? String(restaurant.addressY) : '',
                kosher: Boolean(restaurant.kosher),
                working_hours: restaurant.working_hours || '',
                categories: Array.isArray(restaurant.categories)
                    ? restaurant.categories.map(c => typeof c === 'object' && c !== null ? String(c._id || c.id || c.name || '') : String(c)).filter(id => id && id.length > 0 && id !== '[object Object]' && id !== 'undefined')
                    : [],
                image: restaurant.image || '',
            });
            setError(null);
            setShowDeleteConfirm(false);
        }
    }, [restaurant, visible]);

    if (!restaurant) return null;

    const restId = restaurant._id || restaurant.id;

    const isFormValid =
        formData.name.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.addressX !== '' &&
        !isNaN(Number(formData.addressX)) &&
        formData.addressY !== '' &&
        !isNaN(Number(formData.addressY)) &&
        formData.working_hours.trim() !== '' &&
        formData.image.trim() !== '';

    const handleSave = async () => {
        if (!isFormValid) {
            setError('Please fill out all mandatory fields: Name, Phone, Coordinates, Working Hours, and Image.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            const updatedData = {
                name: formData.name.trim(),
                description: formData.description ? formData.description.trim() : '',
                phone: formData.phone.trim(),
                addressX: parseFloat(formData.addressX),
                addressY: parseFloat(formData.addressY),
                kosher: Boolean(formData.kosher),
                working_hours: formData.working_hours.trim(),
                categories: Array.isArray(formData.categories)
                    ? formData.categories.map(c => typeof c === 'object' && c !== null ? String(c._id || c.id || '') : String(c)).filter(id => id && id.length > 0 && id !== '[object Object]')
                    : [],
                image: formData.image.trim(),
            };

            const updatedRestaurant = await updateRestaurant(restId, updatedData);

            onClose();
            if (onRestaurantUpdated) {
                onRestaurantUpdated('update', updatedRestaurant || { ...restaurant, ...updatedData });
            }
        } catch (err) {
            setError(err.message || 'Failed to update restaurant');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);

            await deleteRestaurant(restId);

            onClose();
            if (onRestaurantUpdated) {
                onRestaurantUpdated('delete', restaurant);
            }
        } catch (err) {
            setError(err.message || 'Failed to delete restaurant');
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Restaurant</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Body */}
                    <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
                        <RestaurantFormFields formData={formData} setFormData={setFormData} />
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        {error && (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {showDeleteConfirm ? (
                            <View style={styles.confirmBox}>
                                <Text style={styles.confirmText}>Are you sure you want to delete this restaurant?</Text>
                                <View style={styles.confirmRow}>
                                    <TouchableOpacity
                                        style={[styles.deleteBtn, { flex: 1, marginTop: 0 }]}
                                        onPress={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <ActivityIndicator color={colors.error} size="small" />
                                        ) : (
                                            <Text style={styles.deleteBtnText}>Confirm Delete</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.cancelBtn, { flex: 1 }]}
                                        onPress={() => setShowDeleteConfirm(false)}
                                        disabled={isDeleting}
                                    >
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    activeOpacity={0.8}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color={colors.primaryText} size="small" />
                                    ) : (
                                        <Text style={styles.saveBtnText}>Save Changes</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => setShowDeleteConfirm(true)}
                                    disabled={isSaving}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.deleteBtnText}>🗑 Delete Restaurant</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={onClose}
                                    disabled={isSaving}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
