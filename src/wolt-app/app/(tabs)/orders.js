import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../constants/theme';
import { createOrdersStyles } from '../../styles/orders.styles';

export default function OrdersScreen() {
  const { colors } = useTheme();
  const styles = createOrdersStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Orders Screen</Text>
      {/* TODO: Implement Orders UI */}
    </View>
  );
}
