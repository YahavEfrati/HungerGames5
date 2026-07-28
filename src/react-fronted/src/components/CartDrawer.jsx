import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const CartDrawer = ({ show, onHide, restaurantId, restaurantName }) => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { getCart, updateItemQuantity, removeItemFromCart } = useContext(CartContext);
    const { items: cartItems, total: cartTotal } = getCart(restaurantId);

    // Strictly hide the cart drawer if the user is a restaurant owner.
    if (currentUser && currentUser.role === 'restaurant_owner') {
        return null;
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const minOrder = 15;
    const isBelowMin = cartTotal < minOrder;

    return (
        <Offcanvas 
            show={show} 
            onHide={onHide} 
            placement="start" 
            className="wolt-cart-drawer"
        >
            <Offcanvas.Header className="wolt-cart-drawer-header">
                <button className="wolt-cart-drawer-close" onClick={onHide}>✕</button>
                <Offcanvas.Title className="wolt-cart-drawer-title">Your order</Offcanvas.Title>
                <div style={{ width: '36px' }}></div> {/* spacer to balance the close button */}
            </Offcanvas.Header>
            <Offcanvas.Body className="wolt-cart-drawer-body p-0">
                {cartItems.length === 0 ? (
                    <div className="wolt-cart-empty">
                        <p>Your cart is empty.</p>
                    </div>
                ) : (
                    <div>
                        {cartItems.map((item, idx) => (
                            <CartItem 
                                key={`${item.id}-${idx}`}
                                item={item}
                                onUpdateQuantity={(item, newQty) => updateItemQuantity(item.id, item.notes, newQty, restaurantId)}
                                onRemove={(item) => removeItemFromCart(item.id, item.notes, restaurantId)}
                            />
                        ))}
                    </div>
                )}
                {/* STRICT UI EXCLUSION: No 'Recommended for you' section here! */}
            </Offcanvas.Body>
            {cartItems.length > 0 && (
                <div className="wolt-cart-drawer-footer">
                    <button 
                        className={`wolt-checkout-btn ${isBelowMin ? 'disabled' : ''}`} 
                        onClick={() => {
                            if (isBelowMin) return;
                            onHide();
                            if (!currentUser) {
                                navigate('/login', { state: { from: `/checkout/${restaurantId}`, message: `Log in to complete your order at ${restaurantName || 'this restaurant'}` } });
                            } else {
                                navigate(`/checkout/${restaurantId}`);
                            }
                        }}
                        style={{ opacity: isBelowMin ? 0.5 : 1, cursor: isBelowMin ? 'not-allowed' : 'pointer' }}
                    >
                        <span>₪{cartTotal.toFixed(2)}</span>
                        <span className="wolt-checkout-text">Go to checkout</span>
                        <div className="wolt-checkout-count">{itemCount}</div>
                    </button>
                    {isBelowMin && (
                        <div className="text-center mt-2 text-danger fw-bold" style={{ fontSize: '0.85rem' }}>
                            Add ₪{(minOrder - cartTotal).toFixed(2)} more to reach the minimum order
                        </div>
                    )}
                </div>
            )}
        </Offcanvas>
    );
};

export default CartDrawer;
