import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createRestaurantStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 18,
      color: colors.error,
      marginBottom: 16,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.primaryText,
      fontWeight: 'bold',
      fontSize: 16,
    },
    // Hero Section
    heroContainer: {
      width: width,
      height: 250,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(0,0,0,0.4)', // Simple gradient alternative
    },
    heroContent: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#FFF',
      marginBottom: 4,
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#FFF',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    backButtonText: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    // Info Bar
    infoBar: {
      backgroundColor: colors.card,
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    infoPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 157, 224, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 12,
    },
    infoPillText: {
      color: colors.primary,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    infoText: {
      color: colors.text,
      fontSize: 14,
      marginRight: 8,
    },
    infoSeparator: {
      color: colors.textSecondary,
      marginRight: 8,
    },
    categoriesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    categoryBadge: {
      backgroundColor: '#e0f7fa',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginTop: 8,
    },
    categoryBadgeText: {
      color: '#006064',
      fontSize: 12,
      fontWeight: 'bold',
    },
    // Menu Section
    menuContainer: {
      padding: 20,
    },
    menuHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    menuTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    addProductButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addProductButtonText: {
      color: colors.primaryText,
      fontWeight: 'bold',
      fontSize: 14,
    },
    emptyMenuText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontStyle: 'italic',
    }
  });
