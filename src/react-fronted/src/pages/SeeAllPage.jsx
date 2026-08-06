import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import { AuthContext } from '../context/AuthContext';
import { getEntityId } from '../utils/idUtils';

const SeeAllPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { currentLocation } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const isTopRated = type === 'top-rated';
    const isNearYou = type === 'near-you';

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                let url = '';

                if (isTopRated) {
                    url = `http://localhost:3000/api/restaurants?sort=topRated`;
                } else if (isNearYou) {
                    const lat = currentLocation?.addressX ?? currentLocation?.lat;
                    const lng = currentLocation?.addressY ?? currentLocation?.lng;
                    if (lat !== undefined && lng !== undefined) {
                        url = `http://localhost:3000/api/restaurants?sort=nearby&lat=${lat}&lng=${lng}`;
                    } else {
                        // If no location is set, fallback to all restaurants without sorting by distance
                        url = `http://localhost:3000/api/restaurants`;
                    }
                } else {
                    url = `http://localhost:3000/api/restaurants`;
                }

                const response = await fetch(url, { 
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRestaurants(data);
                } else {
                    throw new Error('Failed to fetch restaurants');
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [type, currentLocation]);

    const getTitle = () => {
        if (isTopRated) return "Top Rated Restaurants";
        if (isNearYou) return "Dinner near you";
        return "All Restaurants";
    };

    return (
        <Container className="mt-5 pt-5 pb-5">
            <div className="d-flex align-items-center mb-4">
                <Button 
                    variant="link" 
                    className="p-0 me-3 text-decoration-none" 
                    onClick={() => navigate('/')}
                    style={{ color: 'var(--wolt-primary)' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </Button>
                <h2 className="fw-bold m-0">{getTitle()}</h2>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : restaurants.length > 0 ? (
                <Row className="g-4">
                    {restaurants.map(restaurant => (
                        <Col key={getEntityId(restaurant)} xs={12} md={6} lg={4}>
                            <RestaurantCard {...restaurant} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center mt-5">
                    <h4 className="text-muted">No restaurants found.</h4>
                    <Button 
                        className="mt-3 wolt-btn-primary rounded-pill px-4" 
                        onClick={() => navigate('/')}
                    >
                        Browse all categories
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default SeeAllPage;
