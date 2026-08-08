import { useColorScheme } from 'react-native';

export const COLORS = {
    dark: {
        background: '#141414',
        card: '#1f1f1f',
        inputBg: '#2a2a2a',
        inputText: '#ffffff',
        inputPlaceholder: '#888888',
        inputBorder: '#383838',
        inputBorderFocus: '#00c2e8',
        text: '#ffffff',
        textSecondary: '#a0a0a0',
        primary: '#00c2e8', // Wolt cyan
        primaryHover: '#00a3c4',
        primaryText: '#ffffff',
        secondary: '#333333',
        secondaryText: '#ffffff',
        accent: '#ffc107',
        error: '#ff4d4d',
        errorBg: '#3a1e1e',
        success: '#28a745',
        successBg: '#1e3a24',
        border: '#2e2e2e',
        modalOverlay: 'rgba(0, 0, 0, 0.75)',
        popoverBg: '#242424',
    },
    light: {
        background: '#f8f9fa',
        card: '#ffffff',
        inputBg: '#ffffff',
        inputText: '#141414',
        inputPlaceholder: '#777777',
        inputBorder: '#cccccc',
        inputBorderFocus: '#00c2e8',
        text: '#141414',
        textSecondary: '#666666',
        primary: '#00c2e8',
        primaryHover: '#00a3c4',
        primaryText: '#ffffff',
        secondary: '#e9ecef',
        secondaryText: '#141414',
        accent: '#ffc107',
        error: '#d9534f',
        errorBg: '#fdf7f7',
        success: '#28a745',
        successBg: '#f4faf5',
        border: '#e0e0e0',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        popoverBg: '#ffffff',
    }
};

export const useAppTheme = () => {
    const colorScheme = useColorScheme();
    // Default to dark theme as per Wolt theme aesthetic, but dynamically supports light mode
    const isDark = colorScheme !== 'light';
    return isDark ? COLORS.dark : COLORS.light;
};
