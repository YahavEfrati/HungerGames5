import React from 'react';
import { Container } from 'react-bootstrap';
import '../pages/LoginPage.css';

/**
 * Shared AuthLayout component for Login and Registration pages.
 * Enforces Wolt branding structure and responsive layout.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The form to render
 * @param {string} props.title - Main title
 * @param {string} props.subtitle - Subtitle text
 */
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center login-form-width">
            {title && <h1 className="text-white text-center mb-4 fw-bold">{title}</h1>}
            {subtitle && <h4 className="text-white text-center mb-4 fw-bold">{subtitle}</h4>}
            {children}
        </Container>
    );
};

export default AuthLayout;
