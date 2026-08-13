import { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for the Orders screen based on the active theme colors.
 * @param {Object} colors - The theme colors object.
 * @returns {Object} The compiled stylesheet.
 */
export const createOrdersStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.background,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.primary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    emptyStateIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    }
});
