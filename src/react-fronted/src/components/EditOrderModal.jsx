import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';

/**
 * EditOrderModal Sub-component
 * Encapsulates modal dialog popup for modifying coordinate fields, tip, and item quantities.
 */
function EditOrderModal({ show, onHide, order, resolveProductInfo, onSave, availableProducts = [] }) {
    const [editAddressX, setEditAddressX] = useState(0);
    const [editAddressY, setEditAddressY] = useState(0);
    const [editTip, setEditTip] = useState(0);
    const [editItems, setEditItems] = useState([]);
    const [selectedProductToAdd, setSelectedProductToAdd] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Sync input fields when modal opens for a specific order
    useEffect(() => {
        if (order && show) {
            setEditAddressX(order.addressX || 0);
            setEditAddressY(order.addressY || 0);
            setEditTip(order.tip || 0);
            setSelectedProductToAdd('');
            
            const mappedItems = order.items.map(item => {
                const info = resolveProductInfo(order.restaurantId, item.productId);
                if (!info) return null;
                return {
                    productId: String(item.productId),
                    quantity: item.quantity,
                    name: info.name,
                    price: info.price
                };
            }).filter(Boolean);
            
            setEditItems(mappedItems);
            setError(null);
        }
    }, [order, show, resolveProductInfo]);

    const handleUpdateQty = (productId, delta) => {
        setEditItems(prev => {
            return prev.map(item => {
                if (String(item.productId) === String(productId)) {
                    const newQty = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const handleAddProduct = () => {
        if (!selectedProductToAdd) return;
        const prod = availableProducts.find(p => String(p.id) === String(selectedProductToAdd));
        if (!prod) return;
        
        setEditItems(prev => {
            const existing = prev.find(item => String(item.productId) === String(prod.id));
            if (existing) {
                return prev.map(item => 
                    String(item.productId) === String(prod.id) 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                productId: String(prod.id),
                quantity: 1,
                name: prod.name,
                price: Number(prod.price)
            }];
        });
        setSelectedProductToAdd('');
    };

    const handleSaveClick = async () => {
        if (isNaN(Number(editAddressX)) || isNaN(Number(editAddressY))) {
            setError('Address X and Y coordinates must be valid numbers.');
            return;
        }

        if (editItems.length === 0) {
            setError('Order must contain at least one item.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            
            const updateData = {
                addressX: Number(editAddressX),
                addressY: Number(editAddressY),
                tip: Number(editTip) || 0,
                items: editItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            await onSave(order.id, updateData);
        } catch (err) {
            setError(err.message || 'Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered
            contentClassName="wolt-modal-dark"
        >
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Edit Pending Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger mb-3 py-2">{error}</div>}
                
                <Form.Group className="mb-3">
                    <Form.Label className="wolt-modal-label">Address Coordinate X</Form.Label>
                    <Form.Control 
                        type="number"
                        step="any"
                        className="wolt-input-dark"
                        value={editAddressX}
                        onChange={e => setEditAddressX(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="wolt-modal-label">Address Coordinate Y</Form.Label>
                    <Form.Control 
                        type="number"
                        step="any"
                        className="wolt-input-dark"
                        value={editAddressY}
                        onChange={e => setEditAddressY(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="wolt-modal-label">Rider Tip (₪)</Form.Label>
                    <Form.Control 
                        type="number"
                        min="0"
                        step="1"
                        className="wolt-input-dark"
                        value={editTip}
                        onChange={e => setEditTip(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                </Form.Group>

                <div className="mt-4">
                    <div className="wolt-modal-label mb-2">Adjust Ordered Items</div>
                    <div className="edit-items-list">
                        {editItems.map((item) => (
                            <div key={item.productId} className="edit-item-row">
                                <div className="edit-item-meta">
                                    <span className="edit-item-name">{item.name}</span>
                                    <span className="edit-item-price">₪{item.price.toFixed(2)} each</span>
                                </div>
                                <div className="edit-qty-selector">
                                    <button 
                                        className="edit-qty-btn"
                                        onClick={() => handleUpdateQty(item.productId, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="edit-qty-val">{item.quantity}</span>
                                    <button 
                                        className="edit-qty-btn"
                                        onClick={() => handleUpdateQty(item.productId, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="add-product-section d-flex gap-2 mt-3">
                        <Form.Select 
                            className="wolt-input-dark flex-grow-1" 
                            value={selectedProductToAdd}
                            onChange={(e) => setSelectedProductToAdd(e.target.value)}
                        >
                            <option value="">Select a product to add...</option>
                            {availableProducts.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - ₪{Number(p.price).toFixed(2)}</option>
                            ))}
                        </Form.Select>
                        <Button 
                            variant="outline-light" 
                            onClick={handleAddProduct}
                            disabled={!selectedProductToAdd}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    className="btn-wolt-secondary border-0"
                    onClick={onHide}
                    disabled={isSaving}
                >
                    Cancel
                </Button>
                <Button 
                    className="btn-wolt-primary border-0"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditOrderModal;
