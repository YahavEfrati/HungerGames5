import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../constants/theme';

/**
 * Shared Reusable Image Picker Modal Component for Wolt App.
 * Allows users to choose between taking a photo using the camera or selecting from gallery.
 *
 * @param {Object} props
 * @param {boolean} props.visible - Controls visibility of the modal.
 * @param {Function} props.onClose - Callback triggered when the modal is closed/cancelled.
 * @param {Function} props.onTakePhoto - Callback triggered when "Take Photo" is selected.
 * @param {Function} props.onChooseGallery - Callback triggered when "Choose from Gallery" is selected.
 */
export default function ImagePickerModal({
  visible,
  onClose,
  onTakePhoto,
  onChooseGallery,
}) {
  const { colors } = useTheme();

  // Memoize dynamic styles based on active theme colors
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Select Profile Picture</Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onTakePhoto}
          >
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onChooseGallery}
          >
            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelOption}
            onPress={onClose}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.modalOverlay,
    },
    modalCard: {
      width: '85%',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      backgroundColor: colors.card,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    modalOption: {
      width: '100%',
      paddingVertical: 14,
      borderBottomWidth: 1,
      alignItems: 'center',
      borderBottomColor: colors.border,
    },
    modalOptionText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    modalCancelOption: {
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },
  });
