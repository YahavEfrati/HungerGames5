import React from 'react';
import { Card } from 'react-bootstrap';

/**
 * ProductCard Component.
 * Displays a single product info including name, description, price, and image.
 * Matches the exact styling and structure from RestaurantPage.jsx.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.product - The product details.
 * @param {Function} props.onClick - The click handler function.
 */
const ProductCard = ({ product, onClick, children, className, style }) => {
  return (
    <Card 
      className={`wolt-product-card h-100 border-0 shadow-sm ${className || ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer', ...style }}
    >
      {children || (
        <Card.Body className="wolt-product-card-body p-0">
          <div className="wolt-product-content">
            <div className="wolt-product-text-area">
              <Card.Title className="wolt-product-name">
                {product.name}
              </Card.Title>
              <Card.Text className="wolt-product-desc">
                {product.description}
              </Card.Text>
              <div className="wolt-product-price">
                ₪{product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="wolt-product-image-container">
              {product.image || product.imageUrl ? (
                <img 
                  src={product.image || product.imageUrl} 
                  alt={product.name} 
                  className="wolt-product-img" 
                />
              ) : (
                <div className="wolt-product-img-placeholder d-flex justify-content-center align-items-center">
                  <span className="placeholder-icon">🍔</span>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default ProductCard;