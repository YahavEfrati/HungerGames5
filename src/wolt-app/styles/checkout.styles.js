import { StyleSheet, Platform } from 'react-native';

export const createCheckoutStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // --- Hero / Header Section ---
    heroHeader: {
        backgroundColor: colors.card,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.disabledBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    backButtonText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    screenTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    restaurantSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 2,
    },

    // --- Sections & Cards ---
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionActionText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    // --- Delivery Details ---
    coordinatesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    coordinateLabel: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    coordinateValue: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    editAddressContainer: {
        marginTop: 10,
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    inputColumn: {
        flex: 1,
        marginHorizontal: 4,
    },
    inputLabel: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: colors.inputBg,
        color: colors.inputText,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    inputError: {
        borderColor: colors.error,
    },
    fieldErrorText: {
        color: colors.error,
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    confirmAddressBtn: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmAddressBtnDisabled: {
        opacity: 0.5,
    },
    confirmAddressBtnText: {
        color: colors.primaryText,
        fontSize: 14,
        fontWeight: 'bold',
    },


    // --- Tip Section ---
    tipDescription: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 16,
    },
    tipOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
    },
    tipPill: {
        backgroundColor: colors.disabledBg,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tipPillActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    tipPillText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    tipPillTextActive: {
        color: colors.primaryText,
    },
    customTipBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        backgroundColor: colors.disabledBg,
        borderRadius: 24,
        padding: 4,
    },
    customTipBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    customTipBtnText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    customTipInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    customTipInput: {
        backgroundColor: 'transparent',
        color: colors.inputText,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 50,
        padding: 0,
    },
    currencySymbol: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },

    // --- Order Items Summary ---
    summaryItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    summaryItemLeft: {
        flex: 1,
        marginRight: 10,
    },
    summaryItemTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItemQtyBadge: {
        backgroundColor: colors.disabledBg,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
    },
    summaryItemQtyText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    summaryItemName: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    summaryItemNotes: {
        color: colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 3,
        marginLeft: 28,
    },
    summaryItemPrice: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },

    // --- Price Breakdown & Order CTA ---
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    priceLabel: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    priceValue: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8,
    },
    totalLabel: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    taxNote: {
        color: colors.textSecondary,
        fontSize: 11,
        marginBottom: 16,
    },
    placeOrderButton: {
        backgroundColor: colors.primary,
        borderRadius: 26,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    placeOrderButtonDisabled: {
        opacity: 0.6,
    },
    placeOrderButtonText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },

    // --- Empty Cart State ---
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyCartIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyCartTitle: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyCartSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    returnHomeBtn: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 28,
    },
    returnHomeBtnText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
