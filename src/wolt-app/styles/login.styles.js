import { StyleSheet, Platform } from 'react-native';

/**
 * Creates dynamic styles for the Mobile Login Screen based on active theme color tokens.
 * @param {Object} colors - Active theme color tokens.
 * @returns {Object} StyleSheet object.
 */
export const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingHorizontal: 24,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingBottom: 40,
            justifyContent: 'center',
            minHeight: '100%',
        },
        header: {
            alignItems: 'center',
            marginBottom: 28,
        },
        appTitle: {
            fontSize: 30,
            fontWeight: '900',
            marginBottom: 8,
            letterSpacing: 0.5,
            color: colors.primary,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.textSecondary,
            textAlign: 'center',
        },
        alertBanner: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            alignItems: 'center',
        },
        errorBanner: {
            backgroundColor: colors.errorBg,
            borderColor: colors.error,
        },
        successBanner: {
            backgroundColor: colors.successBg,
            borderColor: colors.success,
        },
        infoBanner: {
            backgroundColor: colors.inputBg,
            borderColor: colors.primary,
        },
        errorText: {
            color: colors.error,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        successText: {
            color: colors.success,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        infoText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        formGroup: {
            marginBottom: 20,
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8,
            color: colors.text,
        },
        input: {
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 14,
            fontSize: 15,
            backgroundColor: colors.inputBg,
            color: colors.inputText,
            borderColor: colors.inputBorder,
        },
        inputError: {
            borderColor: colors.error,
        },
        fieldErrorText: {
            color: colors.error,
            fontSize: 12,
            marginTop: 6,
            fontWeight: '500',
        },
        primaryButton: {
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
            marginBottom: 12,
            backgroundColor: colors.primary,
        },
        primaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.primaryText,
        },
        secondaryButton: {
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            backgroundColor: colors.secondary,
            borderColor: colors.border,
        },
        secondaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.secondaryText,
        },
        linkButton: {
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 4,
        },
        linkButtonText: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
        },
        disabledButton: {
            opacity: 0.6,
        },
    });

// Alias for backwards compatibility
export const getStyles = createStyles;
