import React from 'react';

/**
 * Shared CartItem component to render a product in the cart across different drawers and pages.
 * Displays quantity controls, item details, notes, and the product image.
 * 
 * @param {Object} props
 * @param {Object} props.item - The cart item to display
 * @param {Function} props.onUpdateQuantity - Callback when quantity changes (item, newQuantity)
 * @param {Function} props.onRemove - Callback when the remove button is clicked (item)
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const displayImage = item.image ?? item.imageUrl ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80';

    return (
        <div className="wolt-cart-item px-4">
            <div className="wolt-cart-qty-controls">
                <button 
                    className="wolt-cart-qty-ctrl-btn" 
                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                >
                    +
                </button>
                <div className="wolt-cart-qty-display">{item.quantity}</div>
                <button 
                    className="wolt-cart-qty-ctrl-btn" 
                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                >
                    −
                </button>
            </div>
            <div className="wolt-cart-item-details">
                <div className="wolt-cart-item-name">{item.name}</div>
                {item.notes && <div className="wolt-cart-item-notes">{item.notes}</div>}
                <div className="wolt-cart-item-price-row">
                    <div className="wolt-cart-item-price">₪{(Number(item.price) * item.quantity).toFixed(2)}</div>
                    <button 
                        className="wolt-cart-item-remove" 
                        onClick={() => onRemove(item)}
                    >
                        Remove
                    </button>
                </div>
            </div>
            <div className="wolt-cart-item-image">
                <img 
                    src={displayImage} 
                    alt={item.name} 
                    className="wolt-cart-item-img"
                />
            </div>
        </div>
    );
};

export default CartItem;
