import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for Search screen based on active theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingHorizontal: 16,
      height: 48,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.inputText,
      paddingRight: 10,
    },
    searchIcon: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    resultsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 12,
      color: colors.text,
    },
    noResultsText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    restaurantsList: {
      marginBottom: 16,
    },
    restaurantItemWrapper: {
      marginBottom: 16,
      alignItems: 'center',
    },
    productCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    productHeader: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    productRestaurantName: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    productTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    productDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    productPrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      opacity: 0.5,
    },
  });
