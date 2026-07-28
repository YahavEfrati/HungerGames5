import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';
import RestaurantPage from './pages/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage';
import GlobalCartOverviewPage from './pages/GlobalCartOverviewPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import SeeAllPage from './pages/SeeAllPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import { CartProvider } from './context/CartContext';
import PastOrdersPage from './pages/PastOrdersPage';
import ProfilePage from './pages/ProfilePage';

/**
 * Helper component to ensure scrolling is always restored on route changes.
 * Fixes a common React-Bootstrap bug where unmounting a Modal abruptly
 * leaves 'modal-open' class and 'overflow: hidden' on the document body.
 */
function ScrollRestore() {
    const location = useLocation();
    
    useEffect(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, 0);
    }, [location]);

    return null;
}

/**
 * Main Application Component.
 * Handles the routing and global layout of the application.
 */
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <ScrollRestore />
                        <Routes>
                        {/* Routes for login and registration with smooth transitions */}
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />

                        <Route element={<MainLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/restaurant/:id" element={<RestaurantPage />} />
                            <Route path="/category/:name" element={<CategoryPage />} />
                            <Route path="/see-all/:type" element={<SeeAllPage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/checkout" element={<GlobalCartOverviewPage />} />
                            <Route path="/checkout/:restaurantId" element={<CheckoutPage />} />
                            <Route path="/past-orders" element={<PastOrdersPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                        
                        {/* Catch-all route to redirect unknown paths to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;