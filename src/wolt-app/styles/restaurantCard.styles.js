import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for RestaurantCard component based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    cardContainer: {
      width: 240,
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    card: {
      borderRadius: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 120,
    },
    infoContainer: {
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    textContainer: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    description: {
      fontSize: 12,
    },
    distanceBadge: {
      backgroundColor: '#293166',
      borderRadius: 8,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    distanceValue: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    distanceUnit: {
      color: '#ffffff',
      fontSize: 11,
    },
  });
