import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for Discovery (index) screen based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    locationHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(150, 150, 150, 0.1)',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 14,
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 16,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
    },
    filteredContainer: {
      paddingHorizontal: 16,
    },
    filteredTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    gridContainer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    gridItem: {
      marginBottom: 20,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalLabel: {
      fontSize: 12,
      marginBottom: 8,
      fontWeight: '500',
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 8,
    },
    modalButton: {
      marginLeft: 16,
    },
    centerIndicator: {
      marginTop: 20,
      marginBottom: 20,
    },
    topRatedIndicator: {
      marginTop: 20,
    },
    emptyText: {
      color: colors.textSecondary,
    },
    clearFilterButton: {
      backgroundColor: colors.primary,
      marginTop: 16,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginLeft: 16,
    },
    clearFilterButtonText: {
      color: colors.primaryText,
      fontWeight: 'bold',
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontWeight: '600',
    },
    updateLocationButton: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginLeft: 16,
    },
    updateLocationButtonText: {
      color: colors.primaryText,
      fontWeight: 'bold',
    },
  });
