import { StyleSheet } from 'react-native';

export const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            marginBottom: 20,
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        badgeRow: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            flexDirection: 'row',
            gap: 6,
        },
        kosherBadge: {
            backgroundColor: colors.success,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        kosherText: {
            color: '#ffffff',
            fontSize: 11,
            fontWeight: '700',
        },
        ownerControls: {
            paddingHorizontal: 16,
            paddingBottom: 14,
            paddingTop: 4,
            gap: 8,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        infoText: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        editBtn: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
        },
        editBtnText: {
            color: colors.primaryText,
            fontSize: 14,
            fontWeight: '700',
        },
    });
