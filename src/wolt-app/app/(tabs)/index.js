import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, StatusBar, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../../constants/theme';
import CategoriesCarousel from '../../components/CategoriesCarousel';
import RestaurantCarousel from '../../components/RestaurantCarousel';
import RestaurantCard from '../../components/RestaurantCard';
import OwnerRestaurantView from '../../components/OwnerRestaurantView';
import CartButton from '../../components/CartButton';
import { API_URL } from '../../services/userService';
import { getUser } from '../../services/authService';
import { createStyles } from '../../styles/index.styles';


export default function DiscoveryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();


  // User Auth & Role State
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);


  // Data States
  const [categories, setCategories] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [nearYouRestaurants, setNearYouRestaurants] = useState([]);
  
  // Loading States
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [loadingNearYou, setLoadingNearYou] = useState(false);

  // Re-check user role whenever Discovery screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const checkUserRole = async () => {
        try {
          const user = await getUser();
          if (isMounted) {
            if (user && user.role === 'restaurant_owner') {
              setCurrentUser(user);
              setIsOwner(true);
            } else {
              setCurrentUser(user);
              setIsOwner(false);
            }
          }
        } catch (err) {
          console.error('Failed to get user role in Discovery:', err);
          if (isMounted) {
            setCurrentUser(null);
            setIsOwner(false);
          }
        } finally {
          if (isMounted) setCheckingRole(false);
        }
      };
      checkUserRole();
      return () => { isMounted = false; };
    }, [])
  );

  // Location States
  // Initialize with a default location (Tel Aviv)
  const [currentLocation, setCurrentLocation] = useState({ lat: 32.0853, lng: 34.7818 });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLat, setTempLat] = useState('');
  const [tempLng, setTempLng] = useState('');

  // Category Filtering State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch Categories and Top Rated on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchTopRated =   async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants?sort=topRated`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await res.json();
        setTopRatedRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch top rated:", error);
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchCategories();
    fetchTopRated();
  }, []);

  // Fetch Nearby Restaurants when location changes
  useEffect(() => {
    const fetchNearYou = async () => {
      if (!currentLocation || currentLocation.lat === undefined || currentLocation.lng === undefined) {
        setNearYouRestaurants([]);
        return;
      }

      try {
        setLoadingNearYou(true);
        const url = `${API_URL}/restaurants?sort=nearby&lat=${currentLocation.lat}&lng=${currentLocation.lng}`;
        
        const res = await fetch(url, { 
          method: 'GET', 
          headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
          } 
        });

        const data = await res.json();
        setNearYouRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch near you restaurants:", error);
      } finally {
        setLoadingNearYou(false);
      }
    };

    fetchNearYou();
  }, [currentLocation]);

  // Location Modal Handlers
  const handleOpenModal = () => {
    setTempLat(currentLocation ? String(currentLocation.lat) : '');
    setTempLng(currentLocation ? String(currentLocation.lng) : '');
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = () => {
    if (tempLat && tempLng) {
      setCurrentLocation({ 
        lat: parseFloat(tempLat), 
        lng: parseFloat(tempLng) 
      });
      setIsLocationModalOpen(false);
    }
  };

  const handleCategorySelect = (categoryName) => {
    // Toggle off if already selected
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Build a lookup map of category ID -> category name
  const catIdToNameMap = useMemo(() => {
    const map = {};
    if (Array.isArray(categories)) {
      categories.forEach(cat => {
        if (!cat) return;
        const name = (cat.name || '').toLowerCase().trim();
        const id = String(cat._id || cat.id || '').trim();
        if (id && name) {
          map[id] = name;
        }
      });
    }
    return map;
  }, [categories]);

  // Determine base array to filter from (combine nearYou and topRated to ensure complete dataset)
  const baseRestaurants = useMemo(() => {
    const map = new Map();
    (nearYouRestaurants || []).forEach(r => {
      const id = r._id || r.id;
      if (id) map.set(String(id), r);
    });
    (topRatedRestaurants || []).forEach(r => {
      const id = r._id || r.id;
      if (id && !map.has(String(id))) map.set(String(id), r);
    });
    return Array.from(map.values());
  }, [nearYouRestaurants, topRatedRestaurants]);

  // Safely filter based on the active category (supports category objects, strings, ObjectIds, and mapped IDs)
  const filteredRestaurants = useMemo(() => {
    if (!selectedCategory) return [];

    const targetStr = (typeof selectedCategory === 'string'
      ? selectedCategory
      : (selectedCategory.name || selectedCategory._id || '')
    ).toLowerCase().trim();

    return baseRestaurants.filter(r => {
      if (!r || !r.categories) return false;

      let rawList = [];
      if (Array.isArray(r.categories)) {
        rawList = r.categories;
      } else if (typeof r.categories === 'string') {
        rawList = r.categories.split(',').map(s => s.trim());
      }

      return rawList.some(c => {
        if (!c) return false;

        // If category is an object { _id, name, icon }
        if (typeof c === 'object') {
          const name = (c.name || '').toLowerCase().trim();
          const id = String(c._id || c.id || '').toLowerCase().trim();
          return name === targetStr || id === targetStr;
        }

        // If category is a string (could be name, ID, or unpopulated ObjectId)
        if (typeof c === 'string') {
          const val = c.toLowerCase().trim();
          if (val === targetStr) return true;

          // Check if string is an ObjectId mapped in catIdToNameMap
          const mappedName = catIdToNameMap[c] || catIdToNameMap[val];
          if (mappedName && mappedName.toLowerCase().trim() === targetStr) {
            return true;
          }
        }

        return false;
      });
    });
  }, [selectedCategory, baseRestaurants, catIdToNameMap]);

  const isInitialLoading = loadingCategories && loadingTopRated;

  if (checkingRole) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isOwner) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.background === '#0a0c17' ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}>
          <OwnerRestaurantView currentUser={currentUser} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.background === '#0a0c17' ? 'light-content' : 'dark-content'} />
      
      {/* Location Header */}
      <TouchableOpacity 
        style={styles.locationHeader} 
        onPress={handleOpenModal}
        activeOpacity={0.7}
      >
        <Text style={[styles.locationText, { color: colors.primary }]}>
          Your Location: 📍 {currentLocation ? `${Number(currentLocation.lat).toFixed(2)}, ${Number(currentLocation.lng).toFixed(2)}` : 'Set Location'}
        </Text>
      </TouchableOpacity>

      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading Discovery...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          
          {categories.length > 0 && (
            <CategoriesCarousel 
              categories={categories} 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {selectedCategory ? (
            <View style={styles.filteredContainer}>
              <Text style={[styles.filteredTitle, { color: colors.text }]}>
                Restaurants for {selectedCategory}
              </Text>
              
              {filteredRestaurants.length > 0 ? (
                <View style={styles.gridContainer}>
                  {filteredRestaurants.map(restaurant => (
                    <View key={restaurant._id || restaurant.id} style={styles.gridItem}>
                      <RestaurantCard {...restaurant} />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No restaurants found for this category.</Text>
                  <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.clearFilterButton}>
                    <Text style={styles.clearFilterButtonText}>Clear Filter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <>
              {/* Dinner Near You Carousel */}
              {loadingNearYou ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.centerIndicator} />
              ) : (
                nearYouRestaurants.length > 0 && (
                  <RestaurantCarousel 
                    title="Dinner near you" 
                    restaurants={nearYouRestaurants} 
                    onSeeAllPress={() => router.push(`/see-all/near-you?lat=${currentLocation.lat}&lng=${currentLocation.lng}`)}
                  />
                )
              )}

              {/* Top Rated and All Restaurants */}
              {loadingTopRated ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.topRatedIndicator} />
              ) : (
                topRatedRestaurants.length > 0 && (
                  <>
                    <RestaurantCarousel 
                      title="Top Rated Restaurants ⭐" 
                      restaurants={topRatedRestaurants} 
                      onSeeAllPress={() => router.push('/see-all/top-rated')}
                    />
                    
                    <RestaurantCarousel 
                      title="All Restaurants 🍔" 
                      restaurants={[...topRatedRestaurants].reverse()} 
                      onSeeAllPress={() => router.push('/see-all/all')}
                    />
                  </>
                )
              )}
            </>
          )}
          
        </ScrollView>
      )}

      {/* Location Modal */}
      <Modal
        visible={isLocationModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLocationModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Delivery Location</Text>
            
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Latitude (X)</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder }]}
              keyboardType="numeric"
              value={tempLat}
              onChangeText={setTempLat}
              placeholder="e.g. 32.08"
              placeholderTextColor={colors.inputPlaceholder}
            />

            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Longitude (Y)</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder }]}
              keyboardType="numeric"
              value={tempLng}
              onChangeText={setTempLng}
              placeholder="e.g. 34.78"
              placeholderTextColor={colors.inputPlaceholder}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setIsLocationModalOpen(false)} style={styles.modalButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveLocation} style={styles.updateLocationButton}>
                <Text style={styles.updateLocationButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Cart Button (for consumers) */}
      <CartButton />

    </SafeAreaView>
  );
}

