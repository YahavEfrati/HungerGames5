import { StyleSheet, Platform } from 'react-native';

/**
 * Creates dynamic styles for the Mobile Login Screen based on active theme tokens.
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
            color: theme.primary,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.textSecondary,
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
            backgroundColor: theme.errorBg,
            borderColor: theme.error,
        },
        successBanner: {
            backgroundColor: theme.successBg,
            borderColor: theme.success,
        },
        infoBanner: {
            backgroundColor: theme.inputBg,
            borderColor: theme.primary,
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
        infoText: {
            color: theme.primary,
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
        inputError: {
            borderColor: theme.error,
        },
        fieldErrorText: {
            color: theme.error,
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
            marginBottom: 12,
            backgroundColor: theme.secondary,
            borderColor: theme.border,
        },
        secondaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.secondaryText,
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
            color: theme.text,
        },
        disabledButton: {
            opacity: 0.6,
        },
    });
