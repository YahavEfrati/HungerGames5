import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import { getRestaurantById, getRestaurantProducts } from '../services/restaurantService';
import { AuthContext } from '../context/AuthContext';
import ProductModal from './ProductModal';
import AddProductModal from '../components/AddProductModal';
import EditRestaurantModal from '../components/EditRestaurantModal';
import CartButton from '../components/CartButton';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import './RestaurantPage.css';

const RestaurantPage = () => {
    // 1. Extract the restaurant ID from the URL using React Router
    const { id } = useParams();
    const navigate = useNavigate(); // Used for redirection
    const { currentUser } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditRestaurantModal, setShowEditRestaurantModal] = useState(false);
    const [showCartDrawer, setShowCartDrawer] = useState(false);

    const fetchRestaurantData = async () => {
        try {
            setLoading(true);
            const resData = await getRestaurantById(id);
            
            // Fetch Menu (Products are stripped from getRestaurantById, so we fetch explicitly)
            const productsRes = await fetch(`http://localhost:3000/api/restaurants/${id}/products`);
            if(productsRes.ok) {
                resData.products = await productsRes.json();
            } else {
                resData.products = [];
            }

            setRestaurant(resData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch restaurant", err);
            setError("Restaurant not found.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Implement an API call to fetch restaurant details and its menu
    useEffect(() => {
        fetchRestaurantData();
    }, [id]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    if (loading) {
        return (
            <div className="restaurant-loading-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status" className="wolt-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="restaurant-error-container mt-5 text-center">
                <h3 className="text-danger mb-3">Oops! Something went wrong</h3>
                <p className="text-muted">{error}</p>
                <button className="btn wolt-btn-primary mt-3" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </Container>
        );
    }

    if (!restaurant) return null;

    // Fallbacks
    const displayImage = restaurant.bannerImage ?? restaurant.image ?? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80';
    const displayRating = restaurant.rating ?? 9.0;
    const displayDeliveryTime = restaurant.estimatedDeliveryTime ?? 30;
    const displayMinOrder = restaurant.minimumOrder ?? 15.00;
    const displayWorkingHours = restaurant.working_hours ?? "09:00 - 23:00";

    // 3. Style the Banner Area and render the list of dishes
    return (
        <div className="restaurant-page-wrapper">
            {/* Styled Banner Area */}
            <div className="wolt-hero-section">
                <div className="wolt-hero-image" style={{ backgroundImage: `url('${displayImage}')` }}>
                    {currentUser?.role === 'restaurant_owner' && currentUser?.id === restaurant.ownerId && (
                        <div 
                            style={{ 
                                position: 'absolute', 
                                top: '90px', 
                                left: '40px', 
                                zIndex: 10, 
                                cursor: 'pointer', 
                                background: 'rgba(0,0,0,0.6)', 
                                padding: '12px', 
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => setShowEditRestaurantModal(true)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title="Edit Restaurant"
                        >
                            <span className="text-white fs-4" style={{ lineHeight: 1 }}>✏️</span>
                        </div>
                    )}
                    <div className="wolt-hero-gradient"></div>
                    <div className="wolt-hero-content-wrapper">
                        <div className="wolt-hero-text-container">
                            <h1 className="wolt-hero-title">{restaurant.name}</h1>
                            <p className="wolt-hero-subtitle">{restaurant.description}</p>
                        </div>
                        <div className="wolt-hero-logo">
                            <h2 className="wolt-hero-logo-text">{restaurant.name.substring(0, 2).toUpperCase()}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Information Bar */}
            <div className="wolt-info-bar">
                <Container fluid="xl" className="wolt-info-container">
                    <div className="wolt-info-content">
                        <div className="wolt-info-stats">
                            <div className="wolt-time-pill delivery-pill">
                                <span className="me-2">🛵</span> 
                                Estimated delivery {displayDeliveryTime}-{displayDeliveryTime + 10} min
                            </div>
                            <div className="wolt-stat-item">
                                <span className="wolt-rating-icon">😊</span> {displayRating.toFixed(1)}
                            </div>
                            <span className="wolt-stat-separator">•</span>
                            <div className="wolt-stat-item">
                                Open until {displayWorkingHours}
                            </div>
                            <span className="wolt-stat-separator">•</span>
                            <div className="wolt-stat-item">
                                Minimum order ₪{displayMinOrder.toFixed(2)}
                            </div>
                            {restaurant.categories && restaurant.categories.length > 0 && (
                                <>
                                    <span className="wolt-stat-separator">•</span>
                                    <div className="wolt-stat-item d-flex align-items-center flex-wrap gap-1">
                                        {restaurant.categories.map((cat, idx) => (
                                            <span key={idx} className="badge rounded-pill" style={{ backgroundColor: '#e0f7fa', color: '#006064', fontSize: '0.75rem', fontWeight: 'bold' }}>{cat}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="wolt-info-actions">
                            {currentUser && currentUser.role === 'restaurant_owner' && currentUser.id === restaurant.ownerId && (
                                <Button 
                                    variant="primary" 
                                    className="wolt-add-product-btn fw-bold rounded-pill px-4 ms-3 shadow-sm"
                                    onClick={() => setShowAddProductModal(true)}
                                >
                                    + Add Product
                                </Button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Dark Search & Navigation Bar */}
            <div className="wolt-nav-bar">
                <Container fluid="xl" className="wolt-nav-container">
                    <div className="wolt-nav-content">
                        <div className="wolt-search-wrapper">
                            <span className="wolt-search-icon">🔍</span>
                            <input 
                                type="text" 
                                className="wolt-search-input" 
                                placeholder={`Search in ${restaurant.name}`} 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="wolt-categories">

                            <button 
                                className={`wolt-category-item ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Show all items
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Content Area: Render the list of dishes */}
            <div className="wolt-main-content">
                <Container fluid="xl">
                    <div className="restaurant-menu-container pt-4 pb-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                            <h2 className="fw-bold mb-0">Menu</h2>
                        </div>

                        {(() => {
                            const query = searchQuery.toLowerCase();
                            const displayedProducts = restaurant.products.filter(p => 
                                p.name.toLowerCase().includes(query) || 
                                (p.description && p.description.toLowerCase().includes(query))
                            );

                            if (displayedProducts.length === 0 || filter === 'recent') {
                                return (
                                    <div className="text-center py-5 my-5">
                                        <h4 className="text-muted fw-normal">
                                            {filter === 'recent' ? "No recently purchased items." : "No products found."}
                                        </h4>
                                    </div>
                                );
                            }

                            return (
                                <Row className="g-4">
                                    {displayedProducts.map(product => (
                                    <Col key={product.id} xs={12} md={6}>
                                        <ProductCard 
                                            product={product}
                                            onClick={() => handleProductClick(product)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Col>
                                    ))}
                                </Row>
                            );
                        })()}
                    </div>
                </Container>
            </div>

            {/* Product Modal */}
            <ProductModal 
                show={showProductModal}
                onHide={() => setShowProductModal(false)}
                product={selectedProduct}
                isOwner={currentUser && currentUser.role === 'restaurant_owner' && currentUser.id === restaurant.ownerId}
                restaurantId={restaurant.id}
                onProductUpdate={(action, updatedProduct) => {
                    if (action === 'delete') {
                        setRestaurant(prev => ({
                            ...prev,
                            products: prev.products.filter(p => p.id !== selectedProduct.id)
                        }));
                    } else if (action === 'update' && updatedProduct) {
                        setRestaurant(prev => ({
                            ...prev,
                            products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
                        }));
                    } else {
                        // Fallback to fetch
                        getRestaurantProducts(restaurant.id)
                            .then(prods => setRestaurant(prev => ({...prev, products: prods})))
                            .catch(err => console.error("Error refreshing products:", err));
                    }
                }}
            />

            <CartButton onClick={() => setShowCartDrawer(true)} restaurantId={id} />
            <CartDrawer
                show={showCartDrawer}
                onHide={() => setShowCartDrawer(false)}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
            />

            <AddProductModal 
                show={showAddProductModal}
                onHide={() => setShowAddProductModal(false)}
                restaurantId={restaurant?.id}
                onProductAdded={(newProduct) => {
                    if (newProduct) {
                        setRestaurant(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                products: [...(prev.products || []), newProduct]
                            };
                        });
                    } else {
                        fetchRestaurantData();
                    }
                }}
            />
            <EditRestaurantModal 
                show={showEditRestaurantModal}
                onHide={() => setShowEditRestaurantModal(false)}
                restaurant={restaurant}
                onRestaurantUpdate={(action, updatedRest) => {
                    if (action === 'delete') {
                        // Redirect to home if deleted
                        navigate('/');
                    } else if (action === 'update' && updatedRest) {
                        // Optimistically update the local state with the new details
                        setRestaurant(prev => ({
                            ...prev,
                            ...updatedRest
                        }));
                    }
                }}
            />
        </div>
    );
};

export default RestaurantPage;