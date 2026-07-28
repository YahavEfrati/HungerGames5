import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center mt-5 pt-5">
            <h2 className="fw-bold mb-3">Coming Soon!</h2>
            <p className="text-muted mb-4">This page is currently under construction. Stay tuned!</p>
            <Button className="wolt-btn-primary rounded-pill px-4" onClick={() => navigate('/')}>
                Go back home
            </Button>
        </Container>
    );
};

export default PlaceholderPage;
