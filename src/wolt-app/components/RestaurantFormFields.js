import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../constants/theme';
import { getCategories } from '../services/restaurantService';
import ImagePickerModal from './ImagePickerModal';
import { createStyles } from '../styles/restaurantFormFields.styles';

/**
 * Shared component for Restaurant Form Fields used in creation (POST) and editing (PATCH).
 * Reuses ImagePickerModal for media upload and handles category ObjectId mapping.
 */
export default function RestaurantFormFields({ formData, setFormData }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [availableCategories, setAvailableCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);

    useEffect(() => {
        const fetchCatList = async () => {
            try {
                const cats = await getCategories();
                setAvailableCategories(cats);

                // Automatically normalize formData.categories to Mongo _id strings
                if (cats && cats.length > 0 && Array.isArray(formData.categories)) {
                    const normalized = formData.categories.map(c => {
                        const str = typeof c === 'object' && c !== null ? String(c._id || c.id || c.name || '') : String(c);
                        const match = cats.find(catObj => 
                            String(catObj._id || catObj.id) === str || 
                            (catObj.name && catObj.name.toLowerCase() === str.toLowerCase())
                        );
                        return match ? String(match._id || match.id) : str;
                    }).filter(id => id && id.length > 0 && id !== '[object Object]' && id !== 'undefined');

                    if (normalized.length > 0 && JSON.stringify(normalized) !== JSON.stringify(formData.categories)) {
                        setFormData(prev => ({ ...prev, categories: normalized }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch categories in form:', err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCatList();
    }, []);

    // --- Image Picker Handlers ---
    const handleChooseGallery = async () => {
        setIsImagePickerVisible(false);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access gallery is required to choose a cover image.');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const imageUri = asset.base64
                    ? `data:image/jpeg;base64,${asset.base64}`
                    : asset.uri;
                setFormData(prev => ({ ...prev, image: imageUri }));
            }
        } catch (err) {
            console.error('Error selecting image from gallery:', err);
        }
    };

    const handleTakePhoto = async () => {
        setIsImagePickerVisible(false);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access camera is required to take a cover photo.');
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const imageUri = asset.base64
                    ? `data:image/jpeg;base64,${asset.base64}`
                    : asset.uri;
                setFormData(prev => ({ ...prev, image: imageUri }));
            }
        } catch (err) {
            console.error('Error taking photo:', err);
        }
    };

    // --- Category Selection Handlers ---
    const getCatId = (c) => {
        if (c === null || c === undefined) return '';
        const str = typeof c === 'object' ? String(c._id || c.id || c.name || '') : String(c);
        if (availableCategories && availableCategories.length > 0) {
            const match = availableCategories.find(catObj => 
                String(catObj._id || catObj.id) === str || 
                (catObj.name && catObj.name.toLowerCase() === str.toLowerCase())
            );
            if (match) return String(match._id || match.id);
        }
        return str;
    };

    const isCategorySelected = (catObj) => {
        if (!Array.isArray(formData.categories)) return false;
        const targetId = getCatId(catObj);
        if (!targetId) return false;

        return formData.categories.some(c => {
            const existingId = getCatId(c);
            return existingId && existingId === targetId;
        });
    };

    const toggleCategory = (catObj) => {
        const targetId = getCatId(catObj);
        if (!targetId) return;

        const selected = isCategorySelected(catObj);
        setFormData(prev => {
            const currentCats = Array.isArray(prev.categories) ? prev.categories : [];
            if (selected) {
                return {
                    ...prev,
                    categories: currentCats.filter(c => getCatId(c) !== targetId),
                };
            } else {
                return {
                    ...prev,
                    categories: [...currentCats, targetId],
                };
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Cover Image Picker */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Cover Photo <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                    style={styles.imagePickerBox}
                    onPress={() => setIsImagePickerVisible(true)}
                    activeOpacity={0.8}
                >
                    {formData.image ? (
                        <>
                            <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                            <View style={styles.changeOverlay}>
                                <Text style={styles.changeOverlayText}>📷 Change Image</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.placeholderContent}>
                            <Text style={styles.placeholderIcon}>📷</Text>
                            <Text style={styles.placeholderText}>Tap to choose from Gallery or take Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Restaurant Name */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Restaurant Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="e.g. Burger King"
                    placeholderTextColor={colors.inputPlaceholder}
                />
            </View>

            {/* Phone & Working Hours Row */}
            <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.flex1]}>
                    <Text style={styles.label}>
                        Phone <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="050-1234567"
                        placeholderTextColor={colors.inputPlaceholder}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={[styles.fieldGroup, styles.flex1]}>
                    <Text style={styles.label}>
                        Working Hours <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={formData.working_hours}
                        onChangeText={(text) => setFormData({ ...formData, working_hours: text })}
                        placeholder="09:00 - 23:00"
                        placeholderTextColor={colors.inputPlaceholder}
                    />
                </View>
            </View>

            {/* Coordinates (AddressX & AddressY) Row */}
            <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.flex1]}>
                    <Text style={styles.label}>
                        Location X (Lat) <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={formData.addressX !== undefined && formData.addressX !== null ? String(formData.addressX) : ''}
                        onChangeText={(text) => setFormData({ ...formData, addressX: text })}
                        placeholder="32.0853"
                        placeholderTextColor={colors.inputPlaceholder}
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.fieldGroup, styles.flex1]}>
                    <Text style={styles.label}>
                        Location Y (Lng) <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={formData.addressY !== undefined && formData.addressY !== null ? String(formData.addressY) : ''}
                        onChangeText={(text) => setFormData({ ...formData, addressY: text })}
                        placeholder="34.7818"
                        placeholderTextColor={colors.inputPlaceholder}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Description */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Short description of your restaurant..."
                    placeholderTextColor={colors.inputPlaceholder}
                    multiline
                    numberOfLines={3}
                />
            </View>

            {/* Kosher Switch */}
            <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                    <Text style={styles.label}>Kosher Certified</Text>
                    <Text style={styles.switchSublabel}>Is this restaurant Kosher?</Text>
                </View>
                <Switch
                    value={Boolean(formData.kosher)}
                    onValueChange={(val) => setFormData({ ...formData, kosher: val })}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#ffffff"
                />
            </View>

            {/* Categories Selection Chips */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Categories</Text>
                {loadingCategories ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                    <View style={styles.categoriesContainer}>
                        {availableCategories.map((catObj) => {
                            const catName = typeof catObj === 'object' ? catObj.name : catObj;
                            const catIcon = typeof catObj === 'object' ? catObj.icon : '';
                            const selected = isCategorySelected(catObj);
                            return (
                                <TouchableOpacity
                                    key={catObj._id || catName}
                                    style={[
                                        styles.categoryChip,
                                        selected && styles.categoryChipSelected,
                                    ]}
                                    onPress={() => toggleCategory(catObj)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selected && styles.categoryTextSelected,
                                        ]}
                                    >
                                        {selected ? `✓ ${catIcon} ${catName}` : `+ ${catIcon} ${catName}`}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* Image Choice Modal */}
            <ImagePickerModal
                visible={isImagePickerVisible}
                onClose={() => setIsImagePickerVisible(false)}
                onChooseGallery={handleChooseGallery}
                onTakePhoto={handleTakePhoto}
            />
        </View>
    );
}
