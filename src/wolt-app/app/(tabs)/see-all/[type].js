import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import RestaurantCard from '../../../components/RestaurantCard';
import { API_URL } from '../../../services/userService';

export default function SeeAllScreen() {
  const { type, lat, lng } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTopRated = type === 'top-rated';
  const isNearYou = type === 'near-you';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let url = '';

        if (isTopRated) {
          url = `${API_URL}/restaurants?sort=topRated`;
        } else if (isNearYou && lat !== undefined && lng !== undefined) {
          url = `${API_URL}/restaurants?sort=nearby&lat=${lat}&lng=${lng}`;
        } else {
          // Fallback to all restaurants
          url = `${API_URL}/restaurants`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // If it's the 'all' type and we have data, we might want to reverse it 
          // like the homepage does, but it's optional. We will just use the raw data.
          setRestaurants(data);
        } else {
          console.error('Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [type, lat, lng]);

  const getTitle = () => {
    if (isTopRated) return 'Top Rated Restaurants';
    if (isNearYou) return 'Dinner near you';
    return 'All Restaurants';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.background === '#0a0c17' ? 'light-content' : 'dark-content'} />
      
      {/* Header with Back Button (NO Location Header) */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{getTitle()}</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : restaurants.length > 0 ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <RestaurantCard {...item} />
            </View>
          )}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No restaurants found.</Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={{ color: colors.primaryText, fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    alignItems: 'center', // Centers the 240px wide cards on the screen
  },
  gridItem: {
    marginBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  }
});
