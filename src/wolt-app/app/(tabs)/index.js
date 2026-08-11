import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, StatusBar, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import CategoriesCarousel from '../../components/CategoriesCarousel';
import RestaurantCarousel from '../../components/RestaurantCarousel';
import { API_URL } from '../../services/userService';

export default function DiscoveryScreen() {
  const { colors } = useTheme();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [nearYouRestaurants, setNearYouRestaurants] = useState([]);
  
  // Loading States
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [loadingNearYou, setLoadingNearYou] = useState(false);

  // Location States
  // Initialize with a mock default location (Tel Aviv)
  const [currentLocation, setCurrentLocation] = useState({ lat: 32.0853, lng: 34.7818 });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLat, setTempLat] = useState('');
  const [tempLng, setTempLng] = useState('');

  // Fetch Categories and Top Rated on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data && data.POPULAR_CATEGORIES) {
          setCategories(data.POPULAR_CATEGORIES);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchTopRated = async () => {
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

  const isInitialLoading = loadingCategories && loadingTopRated;

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
            <CategoriesCarousel categories={categories} />
          )}

          {/* Dinner Near You Carousel */}
          {loadingNearYou ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20, marginBottom: 20 }} />
          ) : (
            nearYouRestaurants.length > 0 && (
              <RestaurantCarousel 
                title="Dinner near you" 
                restaurants={nearYouRestaurants} 
                onSeeAllPress={() => console.log('See All Near You')}
              />
            )
          )}

          {/* Top Rated and All Restaurants */}
          {loadingTopRated ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            topRatedRestaurants.length > 0 && (
              <>
                <RestaurantCarousel 
                  title="Top Rated Restaurants ⭐" 
                  restaurants={topRatedRestaurants} 
                  onSeeAllPress={() => console.log('See All Top Rated')}
                />
                
                <RestaurantCarousel 
                  title="All Restaurants 🍔" 
                  restaurants={[...topRatedRestaurants].reverse()} 
                  onSeeAllPress={() => console.log('See All Restaurants')}
                />
              </>
            )
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
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveLocation} style={[styles.modalButton, { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 }]}>
                <Text style={{ color: colors.primaryText, fontWeight: 'bold' }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  locationHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 16,
  },
});
