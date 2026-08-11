import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function RestaurantCard({ _id, id, name, description, distance, image }) {
  const { colors } = useTheme();
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

const styles = StyleSheet.create({
  cardContainer: {
    width: 240,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  infoContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  distanceBadge: {
    backgroundColor: '#293166',
    borderRadius: 8,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  distanceUnit: {
    color: '#ffffff',
    fontSize: 11,
  },
});
