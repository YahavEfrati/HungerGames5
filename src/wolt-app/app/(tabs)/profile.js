import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const handleLoginPress = () => {
    // Navigate to the login route once it's created
    // router.push('/(auth)/login');
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  themeToggleText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  regularText: {
    fontSize: 15,
    marginTop: 32,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 340,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
