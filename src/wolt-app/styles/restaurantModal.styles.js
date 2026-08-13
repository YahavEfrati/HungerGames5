import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const createStyles = (colors) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.modalOverlay,
            justifyContent: 'flex-end',
        },
        content: {
            backgroundColor: colors.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: height * 0.9,
            paddingBottom: 24,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
        },
        closeBtn: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.inputBg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeBtnText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        imageContainer: {
            height: 160,
            width: '100%',
            backgroundColor: colors.inputBg,
            position: 'relative',
        },
        coverImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        placeholderImage: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        placeholderText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        changeImageOverlay: {
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
        },
        changeImageText: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: '600',
        },
        bodyScroll: {
            paddingHorizontal: 20,
            paddingVertical: 14,
        },
        footer: {
            paddingHorizontal: 20,
            paddingTop: 12,
            gap: 10,
        },
        errorBanner: {
            backgroundColor: colors.errorBg,
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.error,
        },
        errorText: {
            color: colors.error,
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center',
        },
        saveBtn: {
            backgroundColor: colors.primary,
            borderRadius: 24,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveBtnDisabled: {
            opacity: 0.6,
        },
        saveBtnText: {
            color: colors.primaryText,
            fontSize: 16,
            fontWeight: '700',
        },
        cancelBtn: {
            borderRadius: 24,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        cancelBtnText: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
        },
        deleteBtn: {
            backgroundColor: colors.errorBg,
            borderRadius: 24,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.error,
            marginTop: 4,
        },
        deleteBtnText: {
            color: colors.error,
            fontSize: 15,
            fontWeight: '700',
        },
        confirmBox: {
            backgroundColor: colors.errorBg,
            padding: 14,
            borderRadius: 12,
            gap: 10,
            borderWidth: 1,
            borderColor: colors.error,
        },
        confirmText: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        confirmRow: {
            flexDirection: 'row',
            gap: 10,
        },
    });
