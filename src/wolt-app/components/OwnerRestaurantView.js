import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/theme';
import { getUser } from '../services/authService';
import { getOwnerRestaurants } from '../services/restaurantService';
import OwnerRestaurantCard from './OwnerRestaurantCard';
import AddRestaurantModal from './AddRestaurantModal';
import EditRestaurantModal from './EditRestaurantModal';
import { createStyles } from '../styles/ownerRestaurantView.styles';

/**
 * Dedicated Owner Restaurant Management view component.
 * Replicates design and functionality of web HomePage owner section.
 */
export default function OwnerRestaurantView({ currentUser }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [ownerRestaurants, setOwnerRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRestaurantToEdit, setSelectedRestaurantToEdit] = useState(null);

    const fetchOwnerData = useCallback(async () => {
        try {
            const userObj = currentUser || (await getUser());
            const userId = userObj?._id || userObj?.id;

            if (userId) {
                const myRestaurants = await getOwnerRestaurants(userId);
                setOwnerRestaurants(myRestaurants);
            }
        } catch (err) {
            console.error('Failed to fetch owner restaurants:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchOwnerData();
    }, [fetchOwnerData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOwnerData();
    };

    const handleRestaurantAdded = (newRestaurant) => {
        setOwnerRestaurants(prev => [newRestaurant, ...prev]);
    };

    const handleRestaurantUpdated = (action, payload) => {
        if (action === 'delete') {
            const deletedId = payload._id || payload.id;
            setOwnerRestaurants(prev => prev.filter(r => (r._id || r.id) !== deletedId));
        } else if (action === 'update') {
            const updatedId = payload._id || payload.id;
            setOwnerRestaurants(prev =>
                prev.map(r => ((r._id || r.id) === updatedId ? payload : r))
            );
        }
        setSelectedRestaurantToEdit(null);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Banner Header */}
                <View style={styles.bannerCard}>
                    <View style={styles.bannerHeader}>
                        <Text style={styles.bannerTitle}>My Restaurants 🍽️</Text>
                        <Text style={styles.bannerSubtitle}>Manage your restaurant locations & menus</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setShowAddModal(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addBtnText}>+ Add Restaurant</Text>
                    </TouchableOpacity>
                </View>

                {/* Restaurant List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading your restaurants...</Text>
                    </View>
                ) : ownerRestaurants.length > 0 ? (
                    ownerRestaurants.map((restaurant) => (
                        <OwnerRestaurantCard
                            key={restaurant._id || restaurant.id}
                            restaurant={restaurant}
                            onEditPress={(rest) => setSelectedRestaurantToEdit(rest)}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={{ fontSize: 36 }}>🏪</Text>
                        <Text style={styles.emptyTitle}>No restaurants yet!</Text>
                        <Text style={styles.emptySubtitle}>
                            Click the button above to add your first restaurant location.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Add Restaurant Modal */}
            <AddRestaurantModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onRestaurantAdded={handleRestaurantAdded}
            />

            {/* Edit Restaurant Modal */}
            <EditRestaurantModal
                visible={Boolean(selectedRestaurantToEdit)}
                onClose={() => setSelectedRestaurantToEdit(null)}
                restaurant={selectedRestaurantToEdit}
                onRestaurantUpdated={handleRestaurantUpdated}
            />
        </View>
    );
}
