import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { createProductStyles } from '../styles/product.styles';

export default function ProductCard({ product, onPress }) {
  const { colors } = useTheme();
  const styles = createProductStyles(colors);

  const displayImage = product.image || product.imageUrl;

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
        {product.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}
        <Text style={styles.price}>
          ₪{product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        {displayImage ? (
          <Image 
            source={{ uri: displayImage }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.placeholderIcon}>🍔</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
