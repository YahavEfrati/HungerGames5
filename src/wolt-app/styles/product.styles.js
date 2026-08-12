import { StyleSheet } from 'react-native';

export const createProductStyles = (colors) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    textContainer: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.disabledBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderIcon: {
      fontSize: 32,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlay,
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: 30, // Safe area padding
      maxHeight: '90%',
    },
    modalHeaderImage: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalHeaderPlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: colors.disabledBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    closeButtonText: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalContent: {
      padding: 24,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    modalDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 22,
    },
    modalPrice: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 24,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    quantityButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonText: {
      fontSize: 24,
      color: colors.primary,
      fontWeight: 'bold',
    },
    quantityText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginHorizontal: 24,
    },
    notesContainer: {
      marginBottom: 24,
    },
    notesLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    notesInput: {
      backgroundColor: colors.inputBg,
      color: colors.inputText,
      borderRadius: 12,
      padding: 16,
      minHeight: 100,
      textAlignVertical: 'top',
      fontSize: 16,
    },
    addToCartButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addToCartText: {
      color: colors.primaryText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    addToCartPrice: {
      color: colors.primaryText,
      fontSize: 18,
      fontWeight: 'bold',
    }
  });
