import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for Profile screen based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
