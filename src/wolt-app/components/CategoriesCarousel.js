import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

const BOX_COLORS = [
  '#05233a', // box-color-0
  '#2b1a08', // box-color-1
  '#2b1111', // box-color-2
  '#0c2b18', // box-color-3
  '#250c2b', // box-color-4
];

export default function CategoriesCarousel({ categories }) {
  const { colors } = useTheme();

  const handleCategoryPress = (categoryName) => {
    // TODO: Implement category action (e.g., filter restaurants or navigate)
    console.log(`Category pressed: ${categoryName}`);
  };

  const renderItem = ({ item, index }) => {
    const boxColor = BOX_COLORS[index % BOX_COLORS.length];

    return (
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={() => handleCategoryPress(item.name)}
        activeOpacity={0.8}
      >
        <View style={[styles.squareBox, { backgroundColor: boxColor }]}>
          <Text style={styles.boxIcon}>{item.icon}</Text>
        </View>
        <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.headerText, { color: colors.text }]}>Browse by category</Text>
      
      <FlatList
        data={categories}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 24,
    marginHorizontal: 16, // Adds some breathing room from screen edges
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20, // Pad the inner scroll view so items don't stick to the edge
    gap: 16,
  },
  cardWrapper: {
    alignItems: 'center',
    marginRight: 16, // Space between items
  },
  squareBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  boxIcon: {
    fontSize: 24,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 90,
  },
});
