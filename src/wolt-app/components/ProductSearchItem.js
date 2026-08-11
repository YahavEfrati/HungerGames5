import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { createStyles } from '../styles/ProductSearchItem.styles';

/**
 * ProductSearchItem Component
 * Displays a horizontal row for a product search result with text on the left and a thumbnail on the right.
 */
export default function ProductSearchItem({ _id, id, name, description, price, image, restaurantId, restaurantName }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  
  const handlePress = () => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8} 
      onPress={handlePress}
    >
      <View style={styles.textContainer}>
        {restaurantName && (
          <View style={styles.restaurantNameContainer}>
            <Text style={styles.offeredByText} numberOfLines={1}>
              Offered by: <Text style={styles.restaurantNameText}>{restaurantName}</Text>
            </Text>
          </View>
        )}
        
        <Text style={styles.productName} numberOfLines={1}>
          {name}
        </Text>
        
        {description ? (
          <Text style={styles.productDescription} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        
        <Text style={styles.productPrice}>
          ${price ? parseFloat(price).toFixed(2) : '0.00'}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.productImage} 
          resizeMode="cover" 
        />
      </View>
    </TouchableOpacity>
  );
}
