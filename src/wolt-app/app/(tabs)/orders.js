import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function OrdersScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Orders Screen</Text>
      {/* TODO: Implement Orders UI */}
    </View>
  );
}
