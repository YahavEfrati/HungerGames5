import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function DiscoveryScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Discovery Screen</Text>
      {/* TODO: Implement Discovery/Home UI */}
    </View>
  );
}
