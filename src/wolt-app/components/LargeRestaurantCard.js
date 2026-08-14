import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { createStyles } from '../styles/LargeRestaurantCard.styles';

/**
 * Safely resolves a primitive string display category from a category object, string, or map reference.
 * Prevents objects ({ _id, name, icon }) from ever being rendered directly into JSX children.
 */
const resolveCategoryName = (cat) => {
  if (!cat) return null;
  if (typeof cat === 'string') {
    // If it's a 24-character hex Mongo ObjectId string, do not display raw hex ID
    if (/^[0-9a-fA-F]{24}$/.test(cat)) return null;
    return cat;
  }
  if (typeof cat === 'object' && cat !== null) {
    if (cat.name && typeof cat.name === 'string') return cat.name;
  }
  return null;
};

/**
 * LargeRestaurantCard Component
 * Displays a full-width restaurant card with a large top image and category label.
 * Specifically designed for the redesigned search results screen.
 */
export default function LargeRestaurantCard({ _id, id, name, description, image, categories, category, restaurantCategoryMap }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  
  const restaurantId = _id || id;
  
  // Extract actual category name mimicking web frontend logic
  let displayCategory = resolveCategoryName(category);

  if (!displayCategory && categories && categories.length > 0) {
    displayCategory = resolveCategoryName(categories[0]);
  }

  if (!displayCategory && restaurantCategoryMap && restaurantCategoryMap[restaurantId]) {
    displayCategory = resolveCategoryName(restaurantCategoryMap[restaurantId]);
  }

  const handlePress = () => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text 
            style={styles.title} 
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text 
            style={styles.description} 
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>

        {displayCategory && typeof displayCategory === 'string' && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{displayCategory}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
