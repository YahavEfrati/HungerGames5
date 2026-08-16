import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../constants/theme';
import { createProduct, updateProduct, deleteProduct } from '../services/productService';
import { createProductFormModalStyles } from '../styles/productFormModal.styles';
import ImagePickerModal from './ImagePickerModal';

/**
 * Unified Modal component for Product Administration (Add, Edit, Delete).
 * - If `product` is provided -> Edit / Delete mode.
 * - If `product` is null/undefined -> Add mode.
 * - Native photo selection using expo-image-picker.
 */
export default function ProductFormModal({
  visible,
  onClose,
  product,
  restaurantId,
  onSuccess,
}) {
  const { colors } = useTheme();
  const styles = createProductFormModalStyles(colors);
  const isEditing = Boolean(product);

  const initialForm = {
    name: '',
    description: '',
    price: '',
    image: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price !== undefined && product.price !== null ? String(product.price) : '',
          image: product.image || product.imageUrl || '',
        });
      } else {
        setFormData(initialForm);
      }
      setError(null);
      setIsImagePickerVisible(false);
    }
  }, [visible, product]);

  // --- Image Picker Handlers ---
  const handleChooseGallery = async () => {
    setIsImagePickerVisible(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access gallery is required to select a product photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setFormData((prev) => ({ ...prev, image: imageUri }));
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
        Alert.alert('Permission Denied', 'Permission to access camera is required to take a product photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setFormData((prev) => ({ ...prev, image: imageUri }));
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
  };

  // --- Save / Create / Update Handler ---
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid positive price');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        price: priceNum,
        description: formData.description.trim(),
        image: formData.image ? formData.image.trim() : (isEditing ? (product.image || '') : ''),
      };

      if (isEditing) {
        const pId = product._id || product.id;
        const updated = await updateProduct(restaurantId, pId, payload);
        onSuccess?.('update', updated || { ...product, ...payload });
      } else {
        const created = await createProduct(restaurantId, payload);
        onSuccess?.('add', created);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Delete Handler ---
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to permanently remove "${product?.name}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              setError(null);
              const pId = product._id || product.id;
              await deleteProduct(restaurantId, pId);
              onSuccess?.('delete', product);
              onClose();
            } catch (err) {
              setError(err.message || 'Failed to delete product');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
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
              <Text style={styles.title}>
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form Scroll Area */}
            <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Photo Selector & Preview */}
              <Text style={styles.label}>Product Photo</Text>
              <TouchableOpacity
                style={styles.imagePickerBox}
                onPress={() => setIsImagePickerVisible(true)}
                activeOpacity={0.8}
              >
                {formData.image ? (
                  <>
                    <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                    <View style={styles.changeImageBadge}>
                      <Text style={styles.changeImageBadgeText}>📷 Change Photo</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderIcon}>🍔</Text>
                    <Text style={styles.placeholderText}>
                      Tap to select photo from gallery or camera
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Product Name */}
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="e.g. Cheese Pizza"
                placeholderTextColor={colors.inputPlaceholder}
              />

              {/* Price */}
              <Text style={styles.label}>Price (₪) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="0.00"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="numeric"
              />

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Ingredients, flavors, allergen notes..."
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn, isSaving && styles.btnDisabled]}
                onPress={handleSave}
                disabled={isSaving || isDeleting}
                activeOpacity={0.8}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.primaryText} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {isEditing ? 'Save Changes' : 'Create Product'}
                  </Text>
                )}
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  style={[styles.btn, styles.deleteBtn]}
                  onPress={handleDelete}
                  disabled={isSaving || isDeleting}
                  activeOpacity={0.7}
                >
                  {isDeleting ? (
                    <ActivityIndicator color={colors.error} size="small" />
                  ) : (
                    <Text style={styles.deleteBtnText}>🗑 Delete Product</Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onClose}
                disabled={isSaving || isDeleting}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Picker Option Modal */}
      <ImagePickerModal
        visible={isImagePickerVisible}
        onClose={() => setIsImagePickerVisible(false)}
        onChooseGallery={handleChooseGallery}
        onTakePhoto={handleTakePhoto}
      />
    </>
  );
}
