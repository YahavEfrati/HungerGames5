import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useTheme } from '../../constants/theme';
import { createStyles } from '../../styles/profile.styles';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Mock authentication infrastructure
  const isAuthenticated = false;

  // If the user is not authenticated, immediately redirect them 
  // to the full-screen Guest view outside the tab layout.
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/guest" />;
  }

  // If the user IS authenticated, render the actual Profile view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome to your Profile</Text>
      <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
        This is the authenticated user view.
      </Text>
    </View>
  );
}
