import { StyleSheet } from 'react-native';

export const createEditModalStyles = (colors) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.modalOverlay || 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    mainScroll: {
        flexShrink: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.inputBg,
        color: colors.inputText,
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    errorText: {
        color: colors.error,
        backgroundColor: colors.errorBg,
        padding: 10,
        borderRadius: 6,
        marginBottom: 16,
        fontSize: 14,
    },
    itemsSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
        marginRight: 8,
    },
    itemName: {
        color: colors.text,
        fontWeight: '500',
        fontSize: 14,
    },
    itemPrice: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        backgroundColor: colors.inputBg,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    qtyBtnText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    qtyValue: {
        color: colors.text,
        marginHorizontal: 12,
        fontWeight: '600',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
    },
    cancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    cancelBtnText: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveBtnText: {
        color: colors.primaryText,
        fontWeight: 'bold',
    },
    emptyItemsText: {
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    expandableBarContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    expandBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    expandBarTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    expandBarIcon: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
    },
    availableProductsList: {
        marginTop: 12,
        maxHeight: 150,
    },
    availableProductRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    availableProductInfo: {
        flex: 1,
        marginRight: 8,
    },
    availableProductName: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    availableProductPrice: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    addBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addBtnText: {
        color: colors.primaryText,
        fontSize: 12,
        fontWeight: 'bold',
    }
});
