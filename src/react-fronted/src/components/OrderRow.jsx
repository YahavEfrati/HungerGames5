import React from 'react';
import { getEntityId } from '../utils/idUtils';

/**
 * OrderRow Sub-component
 * Displays a single order item as a table row, featuring status badges and accordion expansion.
 */
function OrderRow({ 
    order, 
    restaurant, 
    isExpanded, 
    onToggleExpand, 
    resolveProductInfo, 
    onEditClick, 
    onCancelClick, 
    onReorderClick 
}) {
    const status = (order.status || 'pending').toUpperCase();

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="order-row-item">
            {/* Compact Horizontal Row Summary */}
            <div className="order-row-summary" onClick={onToggleExpand}>
                <div className="row-cell store-cell">
                    {restaurant.image && (
                        <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="restaurant-thumb-row" 
                        />
                    )}
                    <span className="restaurant-name-row">{restaurant.name}</span>
                </div>
                <div className="row-cell date-cell">
                    {formatDate(order.createdAt)}
                </div>
                <div className="row-cell status-cell">
                    <span className={`status-badge status-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
                <div className="row-cell price-cell">
                    ₪{Number(order.totalPrice).toFixed(2)}
                </div>
                <div className="row-cell expand-cell">
                    <span className={`expand-chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </div>
            </div>

            {/* Accordion Expanded breakdown */}
            {isExpanded && (
                <div className="order-row-details">
                    <div className="details-grid">
                        {/* Left column: Items list */}
                        <div className="details-items-section">
                            <div className="details-section-title">Items Ordered</div>
                            <div className="details-items-list">
                                {order.items.map((item, idx) => {
                                    const info = resolveProductInfo(order.restaurantId, item.productId);
                                    if (!info) return null;
                                    return (
                                        <div key={idx} className="details-item-row">
                                            <div>
                                                <span className="item-qty">{item.quantity}x</span>
                                                <span>{info.name}</span>
                                            </div>
                                            <div>₪{(info.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right column: Details and Actions */}
                        <div className="details-meta-section">
                            <div className="details-section-title">Delivery Details</div>
                            <div className="details-meta-info">
                                <div>
                                    <span className="meta-label">Coordinates X:</span>
                                    <span className="meta-value">{order.addressX}</span>
                                </div>
                                <div>
                                    <span className="meta-label">Coordinates Y:</span>
                                    <span className="meta-value">{order.addressY}</span>
                                </div>
                                <div>
                                    <span className="meta-label">Rider Tip:</span>
                                    <span className="meta-value">₪{Number(order.tip).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="details-actions-wrapper">
                                {order.status === 'pending' ? (
                                    <>
                                        <button 
                                            className="wolt-action-btn btn-wolt-secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditClick(order);
                                            }}
                                        >
                                            ✏️ Edit Order
                                        </button>
                                        <button 
                                            className="wolt-action-btn btn-wolt-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCancelClick(getEntityId(order));
                                            }}
                                        >
                                            ❌ Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        className="wolt-action-btn btn-wolt-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReorderClick(order);
                                        }}
                                    >
                                        🔄 Reorder
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderRow;
