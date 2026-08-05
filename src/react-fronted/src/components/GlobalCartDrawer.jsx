import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas, Spinner } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getRestaurantById } from '../services/restaurantService';
import { getOrders } from '../services/orderService';
import { getEntityId } from '../utils/idUtils';
import '../styles/WoltTheme.css';
import './Cart.css';

const GlobalCartDrawer = ({ show, onHide }) => {
    const { carts, getCart, clearCart } = useContext(CartContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [restaurantInfos, setRestaurantInfos] = useState({});
    const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'past'.
    const [pastOrders, setPastOrders] = useState([]);
    const [loadingPastOrders, setLoadingPastOrders] = useState(false);

    const restaurantInfosRef = React.useRef(restaurantInfos);
    useEffect(() => {
        restaurantInfosRef.current = restaurantInfos;
    }, [restaurantInfos]);

    const activeRestaurantIds = Object.keys(carts).filter(id => carts[id].length > 0);

    // Fetch Restaurant Infos for Active Carts
    useEffect(() => {
        const fetchRestaurants = async () => {
            const infos = { ...restaurantInfos };
            let updated = false;
            for (const id of activeRestaurantIds) {
                if (!infos[id]) {
                    updated = true;
                    try {
                        let resData = await getRestaurantById(id).catch(() => null);
                        if (resData) {
                            infos[id] = resData;
                        }
                    } catch (err) {
                        // In case of error, we just won't have info for this restaurant
                        console.error('Failed to fetch restaurant info for cart', id);
                    }
                }
            }
            if (updated) setRestaurantInfos(infos);
        };
        
        if (activeRestaurantIds.length > 0) {
            fetchRestaurants();
        }
    }, [activeRestaurantIds.join(',')]);

    // Listen for new orders to invalidate cache
    useEffect(() => {
        const handleOrderPlaced = () => {
            setPastOrders([]); // Setting to empty array triggers refetch when tab is opened
        };
        window.addEventListener('orderPlaced', handleOrderPlaced);
        return () => window.removeEventListener('orderPlaced', handleOrderPlaced);
    }, []);

    // Fetch Past Orders
    const fetchPastOrders = async () => {
        if (!currentUser) return;
        try {
            setLoadingPastOrders(true);
            const orders = await getOrders();
            // Sort newest first
            const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPastOrders(sorted);
            
            // Fetch restaurant info for past orders if not already cached
            const currentInfos = restaurantInfosRef.current;
            const uniqueIds = [...new Set(sorted.map(o => o.restaurantId))];
            const missingIds = uniqueIds.filter(id => !currentInfos[id]);
            
            if (missingIds.length > 0) {
                const newInfos = {};
                for (const id of missingIds) {
                    let resData = await getRestaurantById(id).catch(() => null);
                    if (resData) newInfos[id] = resData;
                }
                setRestaurantInfos(prev => ({ ...prev, ...newInfos }));
            }

        } catch (err) {
            console.error("Failed to fetch past orders:", err);
        } finally {
            setLoadingPastOrders(false);
        }
    };

    useEffect(() => {
        if (show && activeTab === 'past') {
            fetchPastOrders();
        }
    }, [show, activeTab, currentUser]);

    // Keep drawer up to date if an order is cancelled or modified from elsewhere
    useEffect(() => {
        const handleOrderChanged = () => {
            fetchPastOrders();
        };
        window.addEventListener('orderChanged', handleOrderChanged);
        window.addEventListener('orderPlaced', handleOrderChanged);
        return () => {
            window.removeEventListener('orderChanged', handleOrderChanged);
            window.removeEventListener('orderPlaced', handleOrderChanged);
        };
    }, [currentUser]);

    const handleCheckoutNavigate = (restId) => {
        onHide();
        if (!currentUser) {
            const restName = restaurantInfos[restId]?.name || 'this restaurant';
            navigate('/login', { state: { from: `/checkout/${restId}`, message: `Log in to complete your order at ${restName}` } });
        } else {
            navigate(`/checkout/${restId}`);
        }
    };

    const handleAddMoreNavigate = (restId) => {
        onHide();
        navigate(`/restaurant/${restId}`);
    };

    const handleClearCart = (restId) => {
        clearCart(restId);
    };

    return (
        <Offcanvas 
            show={show} 
            onHide={onHide} 
            placement="start" 
            className="wolt-cart-drawer global-cart-drawer-custom"
            style={{ width: '420px' }}
        >
            <div className="offcanvas-header">
                <h4 className="fw-bold m-0" style={{ fontSize: '1.6rem' }}>Your Orders</h4>
                <button type="button" className="global-cart-close-btn" onClick={onHide}>
                    ✕
                </button>
            </div>

            <div className="global-cart-segmented-control">
                <button 
                    className={`segmented-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past Orders
                </button>
                <button 
                    className={`segmented-btn ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    Saved Orders
                </button>
            </div>

            <Offcanvas.Body className="p-0 px-4 pb-4">
                {activeTab === 'saved' && (
                    <>
                        {activeRestaurantIds.length === 0 ? (
                            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center mt-5">
                                <h5 className="fw-bold mb-3 text-white">No saved orders</h5>
                                <p className="mb-4 small text-muted">Looks like you haven't added anything to your carts yet.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                {activeRestaurantIds.map(restId => {
                                    const { total } = getCart(restId);
                                    const restInfo = restaurantInfos[restId];
                                    const restName = restInfo ? restInfo.name : 'Unknown Restaurant';
                                    const displayImage = restInfo ? (restInfo.image || restInfo.bannerImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80') : '';
                                    const minOrder = restInfo?.minimumOrder ?? 15;
                                    const isBelowMin = total < minOrder;

                                    return (
                                        <div key={restId} className="global-cart-card">
                                            <button 
                                                className="global-cart-trash-btn"
                                                onClick={() => handleClearCart(restId)}
                                                title="Clear Cart"
                                            >
                                                🗑️
                                            </button>
                                            <div className="global-cart-card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="pe-4 text-end w-100" style={{ direction: 'rtl' }}>
                                                        <div className="global-cart-rest-name">{restName}</div>
                                                        <div className="global-cart-rest-meta">| Tel Aviv</div>
                                                        <div className="global-cart-rest-meta mt-1">Delivery in 30-40 min</div>
                                                    </div>
                                                    {displayImage && (
                                                        <img src={displayImage} alt={restName} className="global-cart-thumbnail ms-3" />
                                                    )}
                                                </div>
                                                
                                                <div className="global-cart-subtotal" style={{ direction: 'rtl' }}>
                                                    Subtotal: ₪{total.toFixed(2)}
                                                </div>

                                                <div className="global-cart-actions" style={{ direction: 'rtl' }}>
                                                    <button 
                                                        className={`btn-proceed ${isBelowMin ? 'disabled' : ''}`}
                                                        onClick={() => !isBelowMin && handleCheckoutNavigate(restId)}
                                                    >
                                                        Proceed to checkout
                                                    </button>
                                                    <button 
                                                        className="btn-add-items"
                                                        onClick={() => handleAddMoreNavigate(restId)}
                                                    >
                                                        Add more items
                                                    </button>
                                                </div>
                                                {isBelowMin && (
                                                    <div className="text-danger fw-bold mt-2 text-end" style={{ fontSize: '0.8rem' }}>
                                                        Add ₪{(minOrder - total).toFixed(2)} more to reach minimum
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'past' && (
                    <>
                        {!currentUser ? (
                            <div className="text-center mt-5 text-white-50">
                                Please log in to view your past orders.
                            </div>
                        ) : loadingPastOrders ? (
                            <div className="d-flex justify-content-center mt-5">
                                <Spinner animation="border" variant="light" />
                            </div>
                        ) : pastOrders.length === 0 ? (
                            <div className="text-center mt-5 text-white-50">
                                You have no past orders yet.
                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                {pastOrders.map(order => {
                                    const restInfo = restaurantInfos[order.restaurantId];
                                    const restName = restInfo ? restInfo.name : 'Restaurant';
                                    const displayImage = restInfo ? (restInfo.image || restInfo.bannerImage) : '';
                                    const dateStr = new Date(order.createdAt).toLocaleDateString();

                                    return (
                                        <div key={getEntityId(order)} className="global-cart-card" onClick={() => {
                                            onHide();
                                            navigate('/past-orders');
                                        }} style={{ cursor: 'pointer' }}>
                                            <div className="global-cart-card-body d-flex justify-content-between align-items-center">
                                                <div className="text-end w-100" style={{ direction: 'rtl' }}>
                                                    <div className="global-cart-rest-name">{restName}</div>
                                                    <div className="global-cart-rest-meta">{dateStr} • {order.status}</div>
                                                    <div className="mt-2 fw-bold">Total: ₪{order.totalPrice?.toFixed(2)}</div>
                                                </div>
                                                {displayImage && (
                                                    <img src={displayImage} alt={restName} className="global-cart-thumbnail ms-3" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default GlobalCartDrawer;
