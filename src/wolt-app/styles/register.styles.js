import { StyleSheet, Platform } from 'react-native';

/**
 * Creates dynamic styles for the Mobile Registration Screen based on active theme tokens.
 * @param {Object} theme - Active theme color tokens.
 * @returns {Object} StyleSheet object.
 */
export const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContent: {
            paddingHorizontal: 24,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingBottom: 40,
        },
        header: {
            alignItems: 'center',
            marginBottom: 24,
            position: 'relative',
        },
        backButton: {
            position: 'absolute',
            left: 0,
            top: 4,
            zIndex: 10,
        },
        backButtonText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.primary,
        },
        appTitle: {
            fontSize: 26,
            fontWeight: '900',
            marginBottom: 8,
            letterSpacing: 0.5,
            color: theme.primary,
        },
        screenTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.text,
        },
        alertBanner: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            alignItems: 'center',
        },
        errorBanner: {
            backgroundColor: theme.errorBg,
            borderColor: theme.error,
        },
        successBanner: {
            backgroundColor: theme.successBg,
            borderColor: theme.success,
        },
        errorText: {
            color: theme.error,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        successText: {
            color: theme.success,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        avatarSection: {
            alignItems: 'center',
            marginBottom: 20,
        },
        avatarContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            overflow: 'hidden',
            borderColor: theme.primary,
            backgroundColor: theme.card,
        },
        avatarImage: {
            width: '100%',
            height: '100%',
        },
        avatarPlaceholder: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarIconText: {
            fontSize: 40,
            color: theme.textSecondary,
        },
        uploadBadge: {
            position: 'absolute',
            bottom: -5,
            right: -5,
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
        },
        uploadBadgeText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: -2,
        },
        avatarHint: {
            fontSize: 12,
            marginTop: 6,
            color: theme.textSecondary,
        },
        formGroup: {
            marginBottom: 16,
        },
        labelRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: theme.text,
        },
        infoIcon: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.primary,
        },
        popover: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 8,
            backgroundColor: theme.popoverBg,
            borderColor: theme.border,
        },
        popoverHeader: {
            fontSize: 13,
            fontWeight: 'bold',
            marginBottom: 4,
            color: theme.accent,
        },
        popoverItem: {
            fontSize: 12,
            marginTop: 2,
            color: theme.text,
        },
        input: {
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 14,
            fontSize: 15,
            backgroundColor: theme.inputBg,
            color: theme.inputText,
            borderColor: theme.inputBorder,
        },
        primaryButton: {
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
            marginBottom: 12,
            backgroundColor: theme.primary,
        },
        primaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.primaryText,
        },
        secondaryButton: {
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            backgroundColor: theme.secondary,
            borderColor: theme.border,
        },
        secondaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.secondaryText,
        },
        disabledButton: {
            opacity: 0.6,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: theme.modalOverlay,
        },
        modalCard: {
            width: '85%',
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            backgroundColor: theme.card,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 16,
            color: theme.text,
        },
        modalOption: {
            width: '100%',
            paddingVertical: 14,
            borderBottomWidth: 1,
            alignItems: 'center',
            borderBottomColor: theme.border,
        },
        modalOptionText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.primary,
        },
        modalCancelOption: {
            width: '100%',
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 4,
        },
        modalCancelText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.error,
        },
    });
