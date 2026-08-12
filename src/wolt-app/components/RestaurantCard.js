import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { createStyles } from '../styles/restaurantCard.styles';

export default function RestaurantCard({ _id, id, name, description, distance, image }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  
  const restaurantId = _id || id;

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
      <View style={[styles.card, { backgroundColor: colors.secondary }]}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, { color: colors.secondaryText }]} 
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text 
              style={[styles.description, { color: colors.textSecondary }]} 
              numberOfLines={1}
            >
              {description}
            </Text>
          </View>

          {distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceValue}>{distance}</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
