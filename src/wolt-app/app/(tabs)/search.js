import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/theme';
import { API_URL } from '../../services/userService';
import RestaurantCard from '../../components/RestaurantCard';
import { createStyles } from '../../styles/search.styles';

/**
 * Mobile Search Screen Component with Real-Time Debounced Querying.
 * Replicates the React Web search functionality by querying /api/search/:query dynamically as the user types.
 */
export default function SearchScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  // Search input state
  const [query, setQuery] = useState('');
  
  // Results state: payload layout matching backend { restaurants: [], products: [] }
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
  const [loading, setLoading] = useState(false);

  /**
   * Real-time search effect with 300ms debouncing logic matching the Web frontend.
   */
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults({ restaurants: [], products: [] });
      setLoading(false);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/search/${encodeURIComponent(trimmedQuery)}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults({
            restaurants: data.restaurants || [],
            products: data.products || [],
          });
        } else {
          setSearchResults({ restaurants: [], products: [] });
        }
      } catch (error) {
        console.error('Real-time search error:', error);
        setSearchResults({ restaurants: [], products: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Top Search Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search in HungerGames..."
            placeholderTextColor={colors.inputPlaceholder}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Magnifying Glass Icon on the Right Side */}
          <Text style={styles.searchIcon}>🔍︎</Text>
        </View>
      </View>

      {/* Main Content Area */}
      {!hasQuery ? (
        /* Empty State */
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>What are we eating today?</Text>
        </View>
      ) : loading ? (
        /* Loading Indicator */
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        /* Results View */
        <ScrollView contentContainerStyle={styles.resultsContainer} keyboardShouldPersistTaps="handled">
          {/* Restaurants Section */}
          <Text style={styles.sectionTitle}>Restaurants</Text>
          {searchResults.restaurants.length > 0 ? (
            <View style={styles.restaurantsList}>
              {searchResults.restaurants.map((restaurant, index) => (
                <View key={restaurant._id || restaurant.id || `res-${index}`} style={styles.restaurantItemWrapper}>
                  <RestaurantCard {...restaurant} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noResultsText}>No restaurants found matching your search.</Text>
          )}

          <View style={styles.divider} />

          {/* Dishes & Products Section */}
          <Text style={styles.sectionTitle}>Dishes & Products</Text>
          {searchResults.products.length > 0 ? (
            searchResults.products.map((product, index) => (
              <TouchableOpacity
                key={product._id || product.id || `prod-${index}`}
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (product.restaurantId) {
                    router.push(`/restaurant/${product.restaurantId}`);
                  }
                }}
              >
                {product.restaurantName && (
                  <Text style={styles.productHeader}>
                    Offered by: <Text style={styles.productRestaurantName}>{product.restaurantName}</Text>
                  </Text>
                )}
                <Text style={styles.productTitle}>{product.name}</Text>
                {product.description ? (
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                  </Text>
                ) : null}
                <Text style={styles.productPrice}>
                  ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No dishes found matching your search.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
