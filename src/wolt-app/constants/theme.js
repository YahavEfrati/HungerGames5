import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const COLORS = {
    dark: {
        background: '#0a0c17',
        card: '#161929',
        inputBg: '#292E45',
        inputText: '#ffffff',
        inputPlaceholder: 'rgba(255, 255, 255, 0.7)',
        inputBorder: 'rgba(255, 255, 255, 0.15)',
        inputBorderFocus: '#009de0',
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        primary: '#009de0',
        primaryText: '#ffffff',
        secondary: '#161929',
        border: 'rgba(255, 255, 255, 0.15)',
        disabledBg: '#171924',
        error: '#ff4d4d',
        errorBg: '#3a1e1e',
        success: '#28a745',
        successBg: '#1e3a24',
        modalOverlay: 'rgba(0, 0, 0, 0.75)',
        popoverBg: '#242424',
        accent: '#ffc107',
        secondaryText: '#ffffff',
    },
    light: {
        background: '#f8f9fa',
        card: '#ffffff',
        inputBg: '#e4e6eb',
        inputText: '#1C1F31',
        inputPlaceholder: '#4b4f56',
        inputBorder: 'rgba(0, 0, 0, 0.15)',
        inputBorderFocus: '#009de0',
        text: '#1C1F31',
        textSecondary: '#4b4f56',
        primary: '#009de0',
        primaryText: '#ffffff',
        secondary: '#ffffff',
        border: 'rgba(0, 0, 0, 0.15)',
        disabledBg: '#e4e6eb',
        error: '#d9534f',
        errorBg: '#fdf7f7',
        success: '#28a745',
        successBg: '#f4faf5',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        popoverBg: '#ffffff',
        accent: '#ffc107',
        secondaryText: '#141414',
    }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme !== 'light');

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
