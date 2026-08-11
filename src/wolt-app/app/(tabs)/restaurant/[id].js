import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../constants/theme';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Restaurant Screen (ID: {id})</Text>
      {/* TODO: Implement Restaurant detail UI */}
    </View>
  );
}
