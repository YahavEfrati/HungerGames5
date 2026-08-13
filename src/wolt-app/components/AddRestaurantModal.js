import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/theme';
import RestaurantFormFields from './RestaurantFormFields';
import { createRestaurant } from '../services/restaurantService';
import { createStyles } from '../styles/restaurantModal.styles';

/**
 * Modal component for Restaurant Creation (POST).
 * Replicates functionality and validation of web AddRestaurantModal.jsx for mobile.
 */
export default function AddRestaurantModal({ visible, onClose, onRestaurantAdded }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const initialFormData = {
        name: '',
        description: '',
        phone: '',
        addressX: '',
        addressY: '',
        kosher: false,
        working_hours: '',
        categories: [],
        image: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible) {
            setFormData(initialFormData);
            setError(null);
        }
    }, [visible]);

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

            const newRestaurant = await createRestaurant({
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
            });

            onClose();
            if (onRestaurantAdded) {
                onRestaurantAdded(newRestaurant);
            }
        } catch (err) {
            setError(err.message || 'Failed to create restaurant');
        } finally {
            setIsSaving(false);
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
                        <Text style={styles.title}>Add New Restaurant</Text>
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

                        <TouchableOpacity
                            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={isSaving}
                            activeOpacity={0.8}
                        >
                            {isSaving ? (
                                <ActivityIndicator color={colors.primaryText} size="small" />
                            ) : (
                                <Text style={styles.saveBtnText}>Create Restaurant</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                            disabled={isSaving}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
