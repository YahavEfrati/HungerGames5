import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { createStyles } from '../styles/categoriesCarousel.styles';

const BOX_COLORS = [
  '#05233a', // box-color-0
  '#2b1a08', // box-color-1
  '#2b1111', // box-color-2
  '#0c2b18', // box-color-3
  '#250c2b', // box-color-4
];

export default function CategoriesCarousel({ categories, selectedCategory, onCategorySelect }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleCategoryPress = (categoryName) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  const renderItem = ({ item, index }) => {
    const boxColor = BOX_COLORS[index % BOX_COLORS.length];
    const isSelected = selectedCategory === item.name;

    return (
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={() => handleCategoryPress(item.name)}
        activeOpacity={0.8}
      >
        <View 
          style={[
            styles.squareBox, 
            { backgroundColor: boxColor },
            isSelected && { borderWidth: 3, borderColor: colors.primary }
          ]}
        >
          <Text style={styles.boxIcon}>{item.icon}</Text>
        </View>
        <Text 
          style={[
            styles.cardName, 
            { color: isSelected ? colors.primary : colors.text },
            isSelected && { fontWeight: 'bold' }
          ]} 
          numberOfLines={1}
        >
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
