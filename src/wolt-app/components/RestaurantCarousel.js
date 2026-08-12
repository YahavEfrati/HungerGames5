import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import RestaurantCard from './RestaurantCard';
import { createStyles } from '../styles/restaurantCarousel.styles';

export default function RestaurantCarousel({ title, restaurants, onSeeAllPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => <RestaurantCard {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
