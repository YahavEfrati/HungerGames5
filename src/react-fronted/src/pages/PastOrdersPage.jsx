import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getOrders, updateOrder, cancelOrder, createOrder } from '../services/orderService';
import { getRestaurantById } from '../services/restaurantService';
import OrderTabControls from '../components/OrderTabControls';
import OrderRow from '../components/OrderRow';
import EditOrderModal from '../components/EditOrderModal';
import { getEntityId, sameEntityId } from '../utils/idUtils';
import './PastOrdersPage.css';

/**
 * PastOrdersPage (Main Container Component)
 * Orchestrates central state management, auth route guards (silent redirect to /login),
 * data fetching and metadata caching, passing resolved data down to sub-components.
 */
function PastOrdersPage() {
    const { currentUser, isAuthLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Core States
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Caches for metadata resolving - no placeholder fallback structures allowed
    const [restaurantsCache, setRestaurantsCache] = useState({});
    const [productsCache, setProductsCache] = useState({});

    // Filter Segmentation & Toggle state
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [toasts, setToasts] = useState([]);

    // Edit Modal Orchestration
    const [showEditModal, setShowEditModal] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    // Immediate auth redirection guard
    useEffect(() => {
        if (!isAuthLoading && !currentUser) {
            navigate('/login', { replace: true });
        }
    }, [currentUser, isAuthLoading, navigate]);

    // Data orchestration load
    const fetchData = async () => {
        if (!currentUser) return;
        
        try {
            setLoading(true);
            setError(null);
            const fetchedOrders = await getOrders();
            
            // Sort newest first
            const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const uniqueRestaurantIds = [...new Set(sortedOrders.map(o => o.restaurantId))];
            const tempRestaurants = {};
            const tempProducts = {};
            
            // Parallel fetches to resolve metadata dynamically
            await Promise.all(uniqueRestaurantIds.map(async (id) => {
                try {
                    const restData = await getRestaurantById(id);
                    tempRestaurants[id] = restData;
                } catch (e) {
                    console.error(`Failed to fetch restaurant metadata for ${id}:`, e);
                }
                
                try {
                    const productsRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/restaurants/${id}/products`);
                    if (productsRes.ok) {
                        const prods = await productsRes.json();
                        tempProducts[id] = prods;
                    }
                } catch (e) {
                    console.error(`Failed to fetch products for restaurant ${id}:`, e);
                }
            }));
            
            setRestaurantsCache(tempRestaurants);
            setProductsCache(tempProducts);
            setOrders(sortedOrders);

        } catch (err) {
            console.error('Error fetching past orders:', err);
            setError(err.message || 'Something went wrong while loading orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchData();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        const handleOrderEvent = () => {
            if (currentUser) fetchData();
        };
        window.addEventListener('orderPlaced', handleOrderEvent);
        window.addEventListener('orderChanged', handleOrderEvent);
        return () => {
            window.removeEventListener('orderPlaced', handleOrderEvent);
            window.removeEventListener('orderChanged', handleOrderEvent);
        };
    }, [currentUser]);

    // Silent background polling for active/pending orders
    const pollOrders = async () => {
        if (!currentUser) return;
        try {
            const fetchedOrders = await getOrders();
            const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            console.error('Error polling past orders:', err);
        }
    };

    // Conditional Polling Hook
    useEffect(() => {
        const hasActiveOrders = orders.some(o => {
            const s = (o.status || '').toLowerCase();
            return s === 'pending' || s === 'active';
        });

        if (!hasActiveOrders) return;

        const intervalId = setInterval(() => {
            pollOrders();
        }, 4000); // Poll every 4 seconds

        return () => clearInterval(intervalId);
    }, [orders, currentUser]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const toggleOrderExpanded = (orderId) => {
        setExpandedOrders(prev => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    // Zero-tolerance data resolver
    const resolveProductInfo = (restaurantId, productId) => {
        const productsList = productsCache[restaurantId] || [];
        const found = productsList.find(p => sameEntityId(getEntityId(p), productId));
        return found ? {
            name: found.name,
            price: Number(found.price)
        } : null;
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This will permanently delete the order from memory.')) {
            return;
        }

        try {
            await cancelOrder(orderId);
            addToast('Order cancelled successfully.', 'success');
            setOrders(prev => prev.filter(o => !sameEntityId(getEntityId(o), orderId)));
        } catch (err) {
            addToast(err.message || 'Failed to cancel order.', 'error');
        }
    };

    const handleOpenEditModal = (order) => {
        setOrderToEdit(order);
        setShowEditModal(true);
    };

    const handleSaveOrderEdit = async (orderId, updateData) => {
        try {
            await updateOrder(orderId, updateData);
            addToast('Order updated successfully.', 'success');
            setShowEditModal(false);
            fetchData();
        } catch (err) {
            throw new Error(err.message || 'Failed to update order.');
        }
    };

    const handleReorder = async (order) => {
        try {
            const orderData = {
                restaurantId: order.restaurantId,
                items: order.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                addressX: order.addressX || (currentUser ? currentUser.addressX : 0),
                addressY: order.addressY || (currentUser ? currentUser.addressY : 0),
                tip: order.tip || 0
            };
            
            await createOrder(orderData);
            addToast('Reordered successfully! A new order has been created.', 'success');
            fetchData();
        } catch (err) {
            addToast(err.message || 'Failed to place reorder.', 'error');
        }
    };

    // Tab calculations
    const activeOrdersList = orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        // Includes new 'active' lifecycle state along with legacy states
        return s === 'pending' || s === 'active' || s === 'accepted' || s === 'in_progress';
    });

    const pastOrdersList = orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        // Includes new 'completed' lifecycle state along with legacy states
        return s === 'completed' || s === 'delivered' || s === 'cancelled';
    });

    const filteredOrders = activeTab === 'active' ? activeOrdersList : pastOrdersList;

    if (loading || !currentUser) {
        return (
            <div className="past-orders-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status" style={{ color: '#009de0' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="past-orders-container">
            {/* Header Banner - Navigation is driven implicitly via global logo/header */}
            <div className="past-orders-header">
                <h1 className="past-orders-title">Order History</h1>
                <div className="past-orders-subtitle">View and manage your current and past order status</div>
            </div>

            {/* Segmented Tabs Control */}
            <OrderTabControls 
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setExpandedOrders(new Set());
                }}
                activeCount={activeOrdersList.length}
                pastCount={pastOrdersList.length}
            />

            {/* Main Content List */}
            {error ? (
                <div className="text-center py-5">
                    <div className="text-danger fs-4 mb-3">⚠️ Failed to Load Orders</div>
                    <p className="text-muted">{error}</p>
                    <button className="wolt-action-btn btn-wolt-primary mt-3" onClick={fetchData}>
                        Try Again
                    </button>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="empty-orders-view">
                    <span className="empty-icon">🥡</span>
                    <h3>No {activeTab} orders</h3>
                    <p>There are currently no orders in this section.</p>
                </div>
            ) : (
                <div className="orders-table">
                    {/* Row Headers */}
                    <div className="orders-table-header">
                        <div>Store</div>
                        <div>Date / Time</div>
                        <div>Status</div>
                        <div>Total Price</div>
                        <div></div>
                    </div>
                    {filteredOrders.map(order => {
                        const restaurant = restaurantsCache[order.restaurantId];
                        // Skip render if metadata is missing (Strict ban on placeholders)
                        if (!restaurant) return null;

                        return (
                            <OrderRow 
                                key={getEntityId(order)}
                                order={order}
                                restaurant={restaurant}
                                isExpanded={expandedOrders.has(getEntityId(order))}
                                onToggleExpand={() => toggleOrderExpanded(getEntityId(order))}
                                resolveProductInfo={resolveProductInfo}
                                onEditClick={handleOpenEditModal}
                                onCancelClick={handleCancelOrder}
                                onReorderClick={handleReorder}
                            />
                        );
                    })}
                </div>
            )}

            {/* EDIT ORDER MODAL */}
            <EditOrderModal 
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                order={orderToEdit}
                resolveProductInfo={resolveProductInfo}
                onSave={handleSaveOrderEdit}
                availableProducts={orderToEdit ? (productsCache[orderToEdit.restaurantId] || []) : []}
            />

            {/* Notification Toasts overlay */}
            <div className="wolt-toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className="wolt-toast">
                        <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PastOrdersPage;
