import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

/**
 * Creates styles for ProductFormModal based on theme colors.
 * @param {Object} colors - The active theme color palette.
 * @returns {Object} StyleSheet styles.
 */
export const createProductFormModalStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.modalOverlay,
      justifyContent: 'flex-end',
    },
    content: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: height * 0.9,
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    errorBox: {
      backgroundColor: colors.errorBg,
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginTop: 12,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.inputBg,
      color: colors.inputText,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    textArea: {
      minHeight: 70,
      textAlignVertical: 'top',
    },
    // Image Picker & Preview Styles
    imagePickerBox: {
      width: '100%',
      height: 150,
      borderRadius: 12,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderStyle: 'dashed',
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    placeholderIcon: {
      fontSize: 32,
      marginBottom: 6,
    },
    placeholderText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    },
    changeImageBadge: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    changeImageBadgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      gap: 8,
    },
    btn: {
      borderRadius: 24,
      paddingVertical: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnDisabled: {
      opacity: 0.6,
    },
    saveBtn: {
      backgroundColor: colors.primary,
    },
    saveBtnText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: '700',
    },
    deleteBtn: {
      backgroundColor: colors.errorBg,
      borderWidth: 1,
      borderColor: colors.error,
    },
    deleteBtnText: {
      color: colors.error,
      fontSize: 15,
      fontWeight: '700',
    },
    cancelBtn: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelBtnText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
  });

export const getStyles = createProductFormModalStyles;
