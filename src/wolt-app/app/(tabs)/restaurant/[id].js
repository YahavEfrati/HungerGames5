import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../constants/theme';
import { createRestaurantStyles } from '../../../styles/restaurant.styles';
import { getRestaurantById, getRestaurantProducts } from '../../../services/restaurantService';
import ProductCard from '../../../components/ProductCard';
import ProductModal from '../../../components/ProductModal';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createRestaurantStyles(colors);

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resData = await getRestaurantById(id);
      const prodsData = await getRestaurantProducts(id);
      
      setRestaurant(resData);
      setProducts(prodsData);
    } catch (err) {
      console.error("Failed to fetch restaurant", err);
      setError("Restaurant not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleAddToCart = (orderItem) => {
    // TODO: Integrate with full Cart Context in the next task
    // Placeholder action for now
    Alert.alert(
      "Added to Order",
      `${orderItem.quantity}x ${orderItem.name} added to your cart.\nNotes: ${orderItem.notes || 'None'}`,
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Something went wrong"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurantData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fallbacks
  const displayImage = restaurant.bannerImage || restaurant.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80';
  const displayRating = restaurant.rating || 9.0;
  const displayDeliveryTime = restaurant.estimatedDeliveryTime || 30;
  const displayMinOrder = restaurant.minimumOrder || 15.00;
  const displayWorkingHours = restaurant.working_hours || "09:00 - 23:00";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: displayImage }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{restaurant.name}</Text>
            {restaurant.description ? (
              <Text style={styles.heroSubtitle}>{restaurant.description}</Text>
            ) : null}
          </View>
        </View>

        {/* Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoRow}>
            <View style={styles.infoPill}>
              <Text>🛵</Text>
              <Text style={styles.infoPillText}>{displayDeliveryTime}-{displayDeliveryTime + 10} min</Text>
            </View>
            <Text style={styles.infoText}>⭐ {displayRating.toFixed(1)}</Text>
            <Text style={styles.infoSeparator}>•</Text>
            <Text style={styles.infoText}>Until {displayWorkingHours}</Text>
            <Text style={styles.infoSeparator}>•</Text>
            <Text style={styles.infoText}>Min ₪{displayMinOrder.toFixed(2)}</Text>
          </View>
          
          {restaurant.categories && restaurant.categories.length > 0 && (
            <View style={styles.categoriesRow}>
              {restaurant.categories.map((cat, idx) => (
                <View key={idx} style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{(cat.name ? cat.name : cat).toString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
                onPress={handleProductPress}
              />
            ))
          ) : (
            <Text style={styles.emptyMenuText}>No dishes available at the moment.</Text>
          )}
        </View>
      </ScrollView>

      {/* Product Customization Modal */}
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}
