import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for CategoriesCarousel component based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      borderRadius: 16,
      marginBottom: 24,
      marginHorizontal: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    listContainer: {
      paddingHorizontal: 20,
      gap: 16,
    },
    cardWrapper: {
      alignItems: 'center',
      marginRight: 16,
    },
    squareBox: {
      width: 70,
      height: 70,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      marginBottom: 10,
    },
    boxIcon: {
      fontSize: 24,
    },
    cardName: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      maxWidth: 90,
    },
  });
