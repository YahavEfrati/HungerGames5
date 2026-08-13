import { StyleSheet } from 'react-native';

export const createOrdersStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
  });
