import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for Guest screen based on theme color tokens.
 * @param {Object} colors - Active theme color tokens from useTheme().
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
    },
    backIcon: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeToggleText: {
      marginRight: 10,
      fontSize: 14,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 80,
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 36,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      marginTop: 8,
      marginBottom: 40,
      textAlign: 'center',
    },
    primaryButton: {
      width: '100%',
      maxWidth: 340,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    regularText: {
      fontSize: 15,
      marginTop: 32,
      marginBottom: 16,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      width: '100%',
      maxWidth: 340,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
  });
