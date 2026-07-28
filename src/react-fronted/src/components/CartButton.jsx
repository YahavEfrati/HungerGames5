import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const CartButton = ({ onClick, restaurantId }) => {
    const { currentUser } = useContext(AuthContext);
    const { getCart } = useContext(CartContext);
    const { items: cartItems, total: cartTotal } = getCart(restaurantId);

    // Strictly hide the cart button if the user is a restaurant owner
    if (currentUser && currentUser.role === 'restaurant_owner') {
        return null;
    }

    // Hide if cart is empty
    if (cartItems.length === 0) {
        return null;
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="wolt-cart-btn-wrapper">
            <button className="wolt-cart-btn" onClick={onClick}>
                <div className="wolt-cart-btn-count">{itemCount}</div>
                <span className="wolt-cart-btn-text">View items</span>
                <span>₪{cartTotal.toFixed(2)}</span>
            </button>
        </div>
    );
};

export default CartButton;
