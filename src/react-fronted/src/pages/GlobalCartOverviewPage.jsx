import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { getRestaurantById } from '../services/restaurantService';
import '../styles/WoltTheme.css';

const GlobalCartOverviewPage = () => {
    const { carts, getCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [restaurantInfos, setRestaurantInfos] = useState({});

    const activeRestaurantIds = Object.keys(carts).filter(id => carts[id].length > 0);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const infos = {};
            for (const id of activeRestaurantIds) {
                try {
                    let restInfo = await getRestaurantById(id).catch(() => null);
                    if (restInfo) {
                        infos[id] = restInfo;
                    }
                } catch (err) {
                    console.error('Failed to load restaurant info for cart overview');
                }
            }
            setRestaurantInfos(infos);
        };
        
        if (activeRestaurantIds.length > 0) {
            fetchRestaurants();
        }
    }, [activeRestaurantIds.join(',')]);

    if (activeRestaurantIds.length === 0) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center mt-5 pt-5">
                <h2 className="fw-bold mb-3">Your cart is empty</h2>
                <p className="text-muted mb-4">Looks like you haven't added anything to your carts yet.</p>
                <Button className="wolt-btn-primary" onClick={() => navigate('/')}>
                    Discover Restaurants
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 pt-4 pb-5">
            <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold m-0">Your Active Carts</h2>
            </div>
            <Row className="g-4">
                {activeRestaurantIds.map(restId => {
                    const { items, total } = getCart(restId);
                    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                    const restInfo = restaurantInfos[restId];
                    const restName = restInfo ? restInfo.name : 'Unknown Restaurant';
                    const displayImage = restInfo ? (restInfo.bannerImage || restInfo.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80') : '';

                    const minOrder = restInfo?.minimumOrder ?? 15;
                    const isBelowMin = total < minOrder;

                    return (
                        <Col key={restId} xs={12} md={6} lg={4}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                {displayImage && (
                                    <div style={{ height: '120px', backgroundImage: `url('${displayImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        <div style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', width: '100%', height: '100%' }}></div>
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="fw-bold mb-3" style={{ fontSize: '1.25rem', marginTop: displayImage ? '-30px' : '0', color: displayImage ? 'white' : 'inherit', zIndex: 1, position: 'relative' }}>
                                        {restName}
                                    </Card.Title>
                                    <div className="mb-3 mt-2 text-muted" style={{ fontSize: '0.95rem' }}>
                                        <strong>{itemCount}</strong> items in cart
                                    </div>
                                    <div className="d-flex flex-column mt-auto pt-3 border-top">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold" style={{ fontSize: '1.1rem' }}>Total: ₪{total.toFixed(2)}</span>
                                            <Button 
                                                className={`wolt-btn-primary rounded-pill px-4 ${isBelowMin ? 'disabled' : ''}`} 
                                                onClick={() => !isBelowMin && navigate(`/checkout/${restId}`)}
                                                style={{ opacity: isBelowMin ? 0.5 : 1, cursor: isBelowMin ? 'not-allowed' : 'pointer' }}
                                            >
                                                Proceed to Checkout
                                            </Button>
                                        </div>
                                        {isBelowMin && (
                                            <div className="text-danger text-end fw-bold" style={{ fontSize: '0.85rem' }}>
                                                Add ₪{(minOrder - total).toFixed(2)} more to reach minimum order
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default GlobalCartOverviewPage;
