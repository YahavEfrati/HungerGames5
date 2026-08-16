yimport { StyleSheet } from 'react-native';

/**
 * Creates dynamic styles for the OrderCard component.
 * @param {Object} colors - The theme colors object.
 * @returns {Object} The compiled stylesheet.
 */
export const createOrderCardStyles = (colors) => StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 12,
        borderWidth: 1,
    },
    editButton: {
        borderColor: colors.primary,
        backgroundColor: 'transparent',
    },
    editButtonText: {
        color: colors.primary,
        fontWeight: '600',
    },
    cancelButton: {
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
    },
    cancelButtonText: {
        color: colors.error,
        fontWeight: '600',
    }
});
