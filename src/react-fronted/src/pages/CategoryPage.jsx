import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import { getEntityId } from '../utils/idUtils';

const CategoryPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryRestaurants = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/restaurants/category/${encodeURIComponent(name)}`);
                if (response.ok) {
                    const data = await response.json();
                    setRestaurants(data);
                } else {
                    throw new Error('Failed to fetch category restaurants');
                }
            } catch (error) {
                console.error('Error fetching category restaurants:', error);
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchCategoryRestaurants();
        }
    }, [name]);

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
                <h2 className="fw-bold m-0">{decodeURIComponent(name)} Restaurants</h2>
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
                    <h4 className="text-muted">No restaurants found for this category.</h4>
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

export default CategoryPage;
