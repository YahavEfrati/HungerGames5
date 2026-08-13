import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../constants/theme';
import { createProductStyles } from '../styles/product.styles';

export default function ProductModal({ visible, onClose, product, onAddToCart }) {
  const { colors } = useTheme();
  const styles = createProductStyles(colors);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset state when a new product is opened
  useEffect(() => {
    if (visible && product) {
      setQuantity(1);
      setNotes('');
    }
  }, [visible, product]);

  if (!product) return null;

  const displayImage = product.image || product.imageUrl;
  const unitPrice = parseFloat(product.price) || 0;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      notes
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Header Image */}
            {displayImage ? (
              <Image 
                source={{ uri: displayImage }} 
                style={styles.modalHeaderImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.modalHeaderPlaceholder}>
                <Text style={{ fontSize: 60 }}>🍔</Text>
              </View>
            )}

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{product.name}</Text>
              
              {product.description ? (
                <Text style={styles.modalDescription}>{product.description}</Text>
              ) : null}

              <Text style={styles.modalPrice}>₪{unitPrice.toFixed(2)}</Text>

              {/* Quantity Selector */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Special Notes Input */}
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Special Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g. No onions, extra sauce..."
                  placeholderTextColor={colors.inputPlaceholder}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  maxLength={200}
                />
              </View>

              {/* Add to Cart Button */}
              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Add to order</Text>
                <Text style={styles.addToCartPrice}>₪{totalPrice.toFixed(2)}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
