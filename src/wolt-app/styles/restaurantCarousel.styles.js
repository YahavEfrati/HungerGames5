import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for RestaurantCarousel component based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginBottom: 32,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    seeAll: {
      fontSize: 16,
      fontWeight: '600',
    },
    listContainer: {
      paddingHorizontal: 16,
    },
  });
