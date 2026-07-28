import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getRestaurantById } from '../services/restaurantService';
import { createOrder } from '../services/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const { currentUser, currentLocation, isAuthLoading } = useContext(AuthContext);
    const { getCart, clearCart } = useContext(CartContext);
    
    // Note: useEffect moved down below state declarations.

    const [tipAmount, setTipAmount] = useState(0);
    const [isCustomTipMode, setIsCustomTipMode] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    // Delivery address state (only for this order)
    const [deliveryX, setDeliveryX] = useState('');
    const [deliveryY, setDeliveryY] = useState('');
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // If user is not authenticated after loading finishes, redirect to login page
    // Placed below state declarations to avoid ReferenceError on restaurantInfo
    useEffect(() => {
        if (!isAuthLoading && !currentUser) {
            const rName = restaurantInfo ? restaurantInfo.name : 'this restaurant';
            navigate('/login', { state: { from: `/checkout/${restaurantId}`, message: `Log in to complete your order at ${rName}` } });
        }
    }, [currentUser, isAuthLoading, navigate, restaurantId, restaurantInfo]);

    // Initialize delivery coordinates once context is loaded
    useEffect(() => {
        const initialX = currentLocation?.addressX ?? currentLocation?.lat ?? currentUser?.addressX ?? 32.0853;
        const initialY = currentLocation?.addressY ?? currentLocation?.lng ?? currentUser?.addressY ?? 34.7818;
        if (deliveryX === '') setDeliveryX(initialX);
        if (deliveryY === '') setDeliveryY(initialY);
    }, [currentLocation, currentUser, deliveryX, deliveryY]);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantById(restaurantId);
                setRestaurantInfo(data);
            } catch (err) {
                console.error("Failed to fetch restaurant details", err);
            }
        };
        fetchRestaurant();
    }, [restaurantId]);

    const { items: cartItems, total: cartTotal } = getCart(restaurantId);

    // If cart is empty, user shouldn't be here, redirect back to cart overview
    if (cartItems.length === 0) {
        return (
            <div className="wolt-checkout-page d-flex flex-column align-items-center justify-content-center text-center p-5">
                <h2 className="mb-4" style={{ color: 'var(--wolt-text-primary)' }}>Your cart is empty</h2>
                <Button className="wolt-place-order-btn w-auto" onClick={() => navigate('/checkout')}>
                    Go back to carts
                </Button>
            </div>
        );
    }

    const finalTotal = cartTotal + tipAmount;

    const tipOptions = [
        { label: '₪ 0', value: 0 },
        { label: '₪ 5', value: 5 },
        { label: '₪ 10', value: 10 },
        { label: '₪ 15', value: 15 }
    ];

    const handlePlaceOrder = async () => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout', messege: "Please log in to complete your order." } });
            return;
        }

        try {
            setIsPlacingOrder(true);
            const orderPayload = {
                restaurantId: restaurantId,
                addressX: Number(deliveryX),
                addressY: Number(deliveryY),
                items: cartItems.map(item => ({
                    productId: String(item.id),
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    notes: item.notes
                }))
            };
            
            await createOrder(orderPayload);
            
            clearCart(restaurantId);
            window.dispatchEvent(new Event('orderPlaced'));
            navigate('/');
        } catch (err) {
            alert(`Error placing order: ${err.message}`);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="wolt-checkout-page">
            <div className="wolt-checkout-hero">
                <Container>
                    <h1>Go to checkout</h1>
                    <p>Ordering from: {restaurantInfo?.name || 'Unknown Restaurant'}</p>
                </Container>
            </div>

            <Container className="wolt-checkout-main">
                <Row className="flex-row-reverse">
                    
                    {/* Sticky Summary Panel (Right Side in LTR if we flex-row, but here we used flex-row-reverse to put it on left like RTL? Let's use standard LTR: Left is content, Right is summary) */}
                    {/* Wait, standard LTR places main content left, summary right. Let's do that by removing flex-row-reverse */}
                    
                </Row>
                <Row>
                    {/* Main Content (Left Side) */}
                    <Col lg={8} className="pe-lg-5">

                        <div className="wolt-checkout-section mt-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="wolt-checkout-section-title m-0">Delivery details</h3>
                                <Button 
                                    variant="link" 
                                    className="text-decoration-none fw-bold p-0" 
                                    style={{ color: '#009de0' }}
                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                >
                                    {isEditingAddress ? 'Cancel' : 'Change'}
                                </Button>
                            </div>
                            <div className="wolt-checkout-card">
                                {!isEditingAddress ? (
                                    <div style={{ color: 'var(--wolt-text-primary)' }}>
                                        <div className="fw-bold mb-1">Coordinates</div>
                                        <div className="small" style={{ color: 'var(--wolt-text-secondary)' }}>Latitude: {Number(deliveryX).toFixed(4)}, Longitude: {Number(deliveryY).toFixed(4)}</div>
                                    </div>
                                ) : (
                                    <Form>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="small fw-bold" style={{ color: 'var(--wolt-text-primary)' }}>Latitude (X)</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        step="0.0001"
                                                        value={deliveryX} 
                                                        onChange={(e) => setDeliveryX(e.target.value)}
                                                        style={{ backgroundColor: 'var(--wolt-disabled-bg)', color: 'var(--wolt-text-primary)', border: '1px solid var(--wolt-muted-border)' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="small fw-bold" style={{ color: 'var(--wolt-text-primary)' }}>Longitude (Y)</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        step="0.0001"
                                                        value={deliveryY} 
                                                        onChange={(e) => setDeliveryY(e.target.value)}
                                                        style={{ backgroundColor: 'var(--wolt-disabled-bg)', color: 'var(--wolt-text-primary)', border: '1px solid var(--wolt-muted-border)' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button 
                                            className="wolt-btn-primary w-100 rounded-pill mt-2" 
                                            onClick={() => setIsEditingAddress(false)}
                                        >
                                            Confirm Address
                                        </Button>
                                    </Form>
                                )}
                            </div>
                        </div>

                        <div className="wolt-checkout-section mt-5">
                            <h3 className="wolt-checkout-section-title">Tip for the courier</h3>
                            <div className="wolt-checkout-card">
                                <p className="wolt-tip-description">
                                    The courier will see the tip after the delivery, and will receive the amount directly after tax deduction
                                </p>
                                <div className="wolt-tip-selector">
                                    <span className="wolt-tip-display">₪ {tipAmount.toFixed(2)}</span>
                                    {tipOptions.map(option => (
                                        <button 
                                            key={option.value}
                                            className={`wolt-tip-pill ${tipAmount === option.value && !isCustomTipMode ? 'active' : ''}`}
                                            onClick={() => {
                                                setTipAmount(option.value);
                                                setIsCustomTipMode(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                    <button 
                                        className={`wolt-tip-pill ${isCustomTipMode ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsCustomTipMode(true);
                                            if (tipAmount === 0) setTipAmount(10); // default starting custom tip
                                        }}
                                    >
                                        Other
                                    </button>
                                </div>
                                {isCustomTipMode && (
                                    <div className="wolt-custom-tip-bar mt-4">
                                        <button 
                                            className="wolt-custom-tip-btn" 
                                            onClick={() => setTipAmount(prev => prev + 1)}
                                        >
                                            +
                                        </button>
                                        <div className="wolt-custom-tip-input-wrapper">
                                            <input 
                                                type="number" 
                                                className="wolt-custom-tip-input" 
                                                value={tipAmount} 
                                                onChange={(e) => setTipAmount(Math.max(0, Number(e.target.value) || 0))}
                                                min="0"
                                            />
                                            <span className="ms-1">₪</span>
                                        </div>
                                        <button 
                                            className="wolt-custom-tip-btn" 
                                            onClick={() => setTipAmount(prev => Math.max(0, prev - 1))}
                                        >
                                            −
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </Col>

                    {/* Summary Panel (Right Side) */}
                    <Col lg={4}>
                        <div className="wolt-summary-panel">
                            <h3 className="wolt-summary-title">Summary</h3>
                            
                            <div className="wolt-summary-row">
                                <span>Subtotal</span>
                                <span className="value">₪{cartTotal.toFixed(2)}</span>
                            </div>

                            {tipAmount > 0 && (
                                <div className="wolt-summary-row">
                                    <span>Tip</span>
                                    <span className="value">₪{tipAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="wolt-summary-divider"></div>

                            <div className="wolt-summary-total">
                                <span>Total</span>
                                <span>₪{finalTotal.toFixed(2)}</span>
                            </div>
                            <div className="wolt-summary-tax-note">
                                Includes taxes (if applicable)
                            </div>

                            <Button 
                                className="wolt-place-order-btn" 
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default CheckoutPage;
