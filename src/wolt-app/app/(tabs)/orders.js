import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import { useTheme } from '../../constants/theme';
import { createOrdersStyles } from '../../styles/orders.styles';
import { getToken, getUser } from '../../services/authService';
import { getOrders, cancelOrder, updateOrder } from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import EditOrderModal from '../../components/EditOrderModal';

/**
 * Orders History Screen.
 * Displays "Active" and "Past" orders using a custom tab navigation.
 * Includes an Authentication Guard to redirect unauthenticated users to the login screen.
 */
export default function OrdersScreen() {
    const { colors } = useTheme();
    const styles = createOrdersStyles(colors);

    // Authentication States
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    
    // Data States
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Edit Modal States
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    // 1. Authentication Guard: Check token on mount
    useEffect(() => {
        let isMounted = true;
        const checkAuth = async () => {
            try {
                const token = await getToken();
                const user = await getUser();
                if (isMounted) {
                    setIsAuthenticated(!!token && !!user);
                    setIsLoadingAuth(false);
                }
            } catch (err) {
                if (isMounted) {
                    setIsAuthenticated(false);
                    setIsLoadingAuth(false);
                }
            }
        };
        checkAuth();
        return () => { isMounted = false; };
    }, []);

    // Fetch Orders Logic
    const fetchOrdersData = async () => {
        try {
            setError(null);
            const fetchedOrders = await getOrders();
            // Sort orders so newest appear first
            const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            // Ignore intentional auth errors since the global interceptor is already redirecting
            if (err.message && err.message.includes('Forbidden')) {
                return; 
            }
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders.');
        } finally {
            setIsLoadingOrders(false);
            setIsRefreshing(false);
        }
    };

    // Load data only if authenticated
    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            fetchOrdersData();
        }
    }, [isLoadingAuth, isAuthenticated]);

    // Handle pull-to-refresh
    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchOrdersData();
    };

    // Handle order cancellation from OrderCard
    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            Alert.alert('Success', 'Order cancelled successfully.');
            // Locally update the state to remove the cancelled order (or refetch entirely)
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to cancel order.');
        }
    };

    const handleEditOrder = (order) => {
        setOrderToEdit(order);
        setIsEditModalVisible(true);
    };

    const handleSaveOrder = async (orderId, updateData) => {
        try {
            await updateOrder(orderId, updateData);
            Alert.alert('Success', 'Order updated successfully.');
            // Refetch orders to get the updated state
            fetchOrdersData();
        } catch (err) {
            throw new Error(err.message || 'Failed to update order.');
        }
    };

    // Immediate Redirect if NOT authenticated
    if (!isLoadingAuth && !isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Show spinner while checking auth or loading initial data
    if (isLoadingAuth || isLoadingOrders) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // 4. Data Filtering Mirroring Web Logic
    const activeOrdersList = orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        return s === 'pending' || s === 'active' || s === 'accepted' || s === 'in_progress';
    });

    const pastOrdersList = orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        return s === 'completed' || s === 'delivered' || s === 'cancelled';
    });

    // Select the current list based on the active tab
    const currentData = activeTab === 'active' ? activeOrdersList : pastOrdersList;

    // Component to display when a tab is empty
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🥡</Text>
            <Text style={styles.emptyStateTitle}>No {activeTab} orders</Text>
            <Text style={styles.emptyStateText}>
                You don't have any {activeTab} orders at the moment.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Screen Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Your Orders</Text>
            </View>

            {/* Top Tabs Custom Layout */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]} 
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                        Active ({activeOrdersList.length})
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'past' && styles.activeTabButton]} 
                    onPress={() => setActiveTab('past')}
                >
                    <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
                        Past ({pastOrdersList.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            {error ? (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <TouchableOpacity 
                        style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 8 }}
                        onPress={() => {
                            setIsLoadingOrders(true);
                            fetchOrdersData();
                        }}
                    >
                        <Text style={{ color: colors.primaryText, fontWeight: 'bold' }}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                    renderItem={({ item }) => (
                        <OrderCard order={item} onCancel={handleCancelOrder} onEdit={handleEditOrder} />
                    )}
                    contentContainerStyle={currentData.length === 0 ? { flex: 1 } : styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefreshing} 
                            onRefresh={handleRefresh} 
                            tintColor={colors.primary} 
                        />
                    }
                />
            )}

            <EditOrderModal 
                visible={isEditModalVisible}
                onClose={() => {
                    setIsEditModalVisible(false);
                    setOrderToEdit(null);
                }}
                order={orderToEdit}
                onSave={handleSaveOrder}
            />
        </View>
    );
}
