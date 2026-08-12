import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { createStyles } from '../styles/LargeRestaurantCard.styles';

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
  // Handle if it's passed as a singular object, or from the categories array
  let displayCategory = null;
  if (category && category.name) {
    displayCategory = category.name;
  } else if (categories && categories.length > 0) {
    const firstCat = categories[0];
    if (typeof firstCat === 'object' && firstCat.name) {
      displayCategory = firstCat.name;
    } else if (typeof firstCat === 'string') {
      // Map it using the restaurant ID mapping if available (fallback for unpopulated backend endpoints)
      displayCategory = (restaurantCategoryMap && restaurantCategoryMap[restaurantId]) 
        ? restaurantCategoryMap[restaurantId] 
        : firstCat;
    }
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

        {displayCategory && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{displayCategory}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
