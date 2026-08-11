import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    // Navigate to the login route once it's created
    // router.push('/(auth)/login');
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HungerGames</Text>
      <Text style={styles.subtitle}>Login to your HungerGames account!</Text>
      
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleLoginPress}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.regularText}>Not registered yet?</Text>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={handleRegisterPress}
        activeOpacity={0.6}
      >
        <Text style={styles.secondaryButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    marginBottom: 40,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#00c2e8', // Wolt light blue
    width: '100%',
    maxWidth: 340,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00c2e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  regularText: {
    fontSize: 15,
    color: '#808080',
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
    borderColor: '#00c2e8',
  },
  secondaryButtonText: {
    color: '#00c2e8',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
