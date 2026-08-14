import { StyleSheet } from 'react-native';

export const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        bannerCard: {
            backgroundColor: colors.disabledBg,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 14,
        },
        bannerHeader: {
            gap: 4,
        },
        bannerTitle: {
            fontSize: 22,
            fontWeight: '800',
            color: colors.text,
        },
        bannerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        addBtn: {
            backgroundColor: colors.primary,
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            alignSelf: 'flex-start',
        },
        addBtnText: {
            color: colors.primaryText,
            fontSize: 15,
            fontWeight: '700',
        },
        loadingContainer: {
            paddingVertical: 40,
            alignItems: 'center',
            gap: 12,
        },
        loadingText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        emptyContainer: {
            backgroundColor: colors.disabledBg,
            borderRadius: 20,
            padding: 30,
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            marginTop: 10,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
        },
        emptySubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        listContent: {
            paddingBottom: 40,
        },
    });
