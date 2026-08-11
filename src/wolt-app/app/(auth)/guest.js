import React from 'react';
import { View, Text, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { createStyles } from '../../styles/guest.styles';

/**
 * Guest Screen
 * This screen is presented when an unauthenticated user attempts to access the Profile tab.
 * It takes up the full screen (hiding bottom tabs) and provides options to Login or Register.
 */
export default function GuestScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/register');
  };

  /**
   * Safely handles back navigation.
   * If there is a screen in the history stack, it goes back.
   * Otherwise (e.g. redirected via tab click), it returns to the Home tab.
   */
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        {/* Back Button to prevent trapping the user */}
        <TouchableOpacity 
          onPress={handleBackPress} 
          style={styles.backButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <View style={styles.themeToggleContainer}>
          <Text style={[styles.themeToggleText, { color: colors.text }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>HungerGames</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Login to your HungerGames account!</Text>
        
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
          onPress={handleLoginPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, { color: colors.primaryText }]}>Login</Text>
        </TouchableOpacity>
        
        <Text style={[styles.regularText, { color: colors.textSecondary }]}>Not registered yet?</Text>
        
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: colors.primary }]} 
          onPress={handleRegisterPress}
          activeOpacity={0.6}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
