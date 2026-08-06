import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { updateRestaurantProduct, deleteRestaurantProduct } from '../services/restaurantService';
import { isEmpty } from '../utils/validationUtils';
import { getEntityId } from '../utils/idUtils';
import './ProductModal.css';

const ProductModal = ({ show, onHide, product, isOwner, restaurantId, onProductUpdate }) => {
    const [quantity, setQuantity] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({ name: '', price: '', description: '', image: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const { addItemToCart } = useContext(CartContext);
    const { currentUser } = useContext(AuthContext);

    // Track product views for the recommendation engine
    useEffect(() => {
        if (show && product && currentUser) {
            const trackProductView = async () => {
                try {
                    const token = localStorage.getItem('jwt_token');
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
                    const productId = getEntityId(product);
                    
                    // Fire-and-forget GET request to trigger backend TCP tracking
                    await fetch(`${apiUrl}/restaurants/${restaurantId}/products/${productId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    console.error("Failed to track product view", error);
                }
            };
            trackProductView();
        }
    }, [show, product, currentUser, restaurantId]);

    // Reset state when modal opens or product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setEditMode(false);
            setEditedData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                image: product.image || product.imageUrl || ''
            });
            setError(null);
            setNotes('');
            setShowDeleteConfirm(false);
            setIsDragging(false);
        }
    }, [product, show]);

    if (!product) return null;

    const isDirty = 
        editedData.name !== product.name || 
        String(editedData.price) !== String(product.price) || 
        editedData.description !== (product.description || '') ||
        editedData.image !== (product.image || product.imageUrl || '');

    const handleSave = async () => {
        if (!isDirty) {
            setEditMode(false);
            return;
        }

        if (isEmpty(editedData.name) || isEmpty(editedData.price) || Number(editedData.price) <= 0 || isEmpty(editedData.image)) {
            setError('Please fill out all mandatory fields: name, positive price, and image.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            const updatedProdPayload = {
                name: editedData.name,
                price: Number(editedData.price),
                description: editedData.description,
                image: editedData.image
            };
            const updatedProduct = await updateRestaurantProduct(restaurantId, getEntityId(product), updatedProdPayload);
            setEditMode(false);
            if (onProductUpdate) {
                onProductUpdate('update', updatedProduct || { ...product, ...updatedProdPayload });
            }
        } catch (err) {
            setError(err.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            await deleteRestaurantProduct(restaurantId, getEntityId(product));
            onHide();
            if (onProductUpdate) {
                onProductUpdate('delete');
            }
        } catch (err) {
            setError(err.message || 'Failed to delete product');
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Drag and Drop Handlers ---
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedData(prev => ({ ...prev, image: e.target.result }));
                setError(null);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please drop a valid image file.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        addItemToCart({ ...product, quantity, notes }, restaurantId);
        onHide(); // Close modal after adding
    };

    return (
        <>
        <Modal show={show && !showDeleteConfirm} onHide={onHide} centered contentClassName="wolt-modal-content">
            {editMode ? (
                <div 
                    className={`wolt-modal-header dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <button className="wolt-modal-close-btn" onClick={(e) => { e.stopPropagation(); onHide(); }}>✕</button>
                    {editedData.image ? (
                        <img src={editedData.image} alt="Preview" className="wolt-modal-img" />
                    ) : (
                        <div className="wolt-upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <p className="upload-text">Drag & drop image here or click to upload</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                    />
                </div>
            ) : (
                <div className="wolt-modal-header">
                    <button className="wolt-modal-close-btn" onClick={onHide}>✕</button>
                    {(() => {
                        const displayImage = product.image ?? product.imageUrl;
                        return displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={product.name} 
                                className="wolt-modal-img" 
                            />
                        ) : (
                            <div className="wolt-upload-placeholder">
                                <span className="upload-icon">🍔</span>
                            </div>
                        );
                    })()}
                </div>
            )}
            
            <Modal.Body className="wolt-modal-body">
                {error && <div className="text-danger mb-3">{error}</div>}
                
                {editMode ? (
                    <div className="wolt-edit-form">
                        <label className="wolt-edit-label">Product Name</label>
                        <input 
                            type="text" 
                            className="wolt-modal-input" 
                            value={editedData.name}
                            onChange={e => setEditedData({...editedData, name: e.target.value})}
                        />
                        
                        <label className="wolt-edit-label mt-3">Price (₪)</label>
                        <input 
                            type="number" 
                            className="wolt-modal-input" 
                            value={editedData.price}
                            onChange={e => setEditedData({...editedData, price: e.target.value})}
                        />
                        
                        <label className="wolt-edit-label mt-3">Description</label>
                        <textarea 
                            className="wolt-modal-input wolt-modal-textarea" 
                            rows={3}
                            value={editedData.description}
                            onChange={e => setEditedData({...editedData, description: e.target.value})}
                        />
                    </div>
                ) : (
                    <>
                        <h2 className="wolt-modal-title">{product.name}</h2>
                        <div>
                            <span className="wolt-modal-badge">Popular</span>
                            <span className="wolt-modal-price">₪{Number(product.price).toFixed(2)}</span>
                        </div>
                        <p className="wolt-modal-desc">{product.description}</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer className="wolt-modal-footer">
                {!editMode && !isOwner && (
                    <div className="wolt-quantity-selector">
                        <button className="wolt-qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                        <span className="wolt-qty-value">{quantity}</span>
                        <button className="wolt-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                )}
                
                {isOwner ? (
                    editMode ? (
                        <div className="d-flex flex-column w-100 gap-2">
                            <Button 
                                className={`wolt-modal-action-btn ${!isDirty ? 'btn-secondary' : 'btn-primary'} w-100`} 
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? <Spinner size="sm" animation="border" /> : (isDirty ? 'Save Changes' : 'Cancel')}
                            </Button>
                        </div>
                    ) : (
                        <div className="d-flex flex-column w-100 gap-2">
                            <Button className="wolt-modal-action-btn w-100" onClick={() => setEditMode(true)}>
                                Edit Product
                            </Button>
                            <Button className="wolt-modal-action-btn wolt-modal-action-btn-danger w-100" onClick={() => setShowDeleteConfirm(true)}>
                                Delete Product
                            </Button>
                        </div>
                    )
                ) : (
                    <Button className="wolt-modal-action-btn" onClick={handleAddToCart}>
                        <span className="wolt-modal-action-text">Add to order</span>
                        <span className="wolt-modal-action-price">₪{(Number(product.price) * quantity).toFixed(2)}</span>
                    </Button>
                )}
            </Modal.Footer>
        </Modal>

        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered contentClassName="wolt-modal-content">
            <Modal.Body className="wolt-modal-body text-center p-5">
                <div className="mb-4" style={{ fontSize: '3rem' }}>🗑️</div>
                <h3 className="wolt-modal-title mb-3">Delete Product?</h3>
                <p className="wolt-modal-desc mb-4">Are you sure you want to permanently delete <strong>{product.name}</strong> from your menu? This action cannot be undone.</p>
                <div className="d-flex flex-column gap-3 w-100">
                    <Button 
                        variant="danger" 
                        className="w-100 py-3 fw-bold rounded-3" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Spinner size="sm" animation="border" /> : 'Yes, Delete Product'}
                    </Button>
                    <Button 
                        variant="light" 
                        className="wolt-btn-outline w-100" 
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default ProductModal;
