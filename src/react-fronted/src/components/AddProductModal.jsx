import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spinner, Alert } from 'react-bootstrap';
import { addRestaurantProduct } from '../services/restaurantService';
import { isEmpty } from '../utils/validationUtils';
import '../pages/ProductModal.css';

const AddProductModal = ({ show, onHide, restaurantId, onProductAdded }) => {
    const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setFormData({ name: '', price: '', description: '', image: '' });
            setError(null);
            setIsDragging(false);
        }
    }, [show]);

    const isFormValid = !isEmpty(formData.name) && 
                        !isEmpty(formData.price) && 
                        Number(formData.price) > 0 &&
                        !isEmpty(formData.description) && 
                        !isEmpty(formData.image);

    const handleSave = async () => {
        if (!isFormValid) {
            setError('Please fill out all fields and upload an image.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            const newProd = await addRestaurantProduct(restaurantId, {
                name: formData.name.trim(),
                price: Number(formData.price),
                description: formData.description.trim(),
                image: formData.image.trim() // this will be base64 or URL
            });
            onHide();
            if (onProductAdded) {
                onProductAdded(newProd);
            }
        } catch (err) {
            setError(err.message || 'Failed to add new product');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Drag and Drop Handlers ---
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({ ...prev, image: e.target.result }));
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

    return (
        <Modal show={show} onHide={onHide} centered contentClassName="wolt-modal-content">
            <div 
                className={`wolt-modal-header dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <button className="wolt-modal-close-btn" onClick={(e) => { e.stopPropagation(); onHide(); }}>✕</button>
                
                {formData.image ? (
                    <img src={formData.image} alt="Preview" className="wolt-modal-img" />
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
            
            <Modal.Body className="wolt-modal-body">
                <div className="wolt-edit-form">
                    <label className="wolt-edit-label">Product Name</label>
                    <input 
                        type="text" 
                        className="wolt-modal-input" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Spicy Miso Ramen"
                    />
                    
                    <label className="wolt-edit-label mt-3">Price (₪)</label>
                    <input 
                        type="number" 
                        min="1"
                        step="0.01"
                        className="wolt-modal-input" 
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                    />
                    
                    <label className="wolt-edit-label mt-3">Description</label>
                    <textarea 
                        className="wolt-modal-input wolt-modal-textarea" 
                        rows={3} 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Miso seasoned broth with chili paste..."
                    />
                </div>
            </Modal.Body>
            
            <Modal.Footer className="wolt-modal-footer flex-column gap-2">
                {error && <Alert variant="danger" className="w-100 mb-2">{error}</Alert>}
                <button 
                    type="button"
                    className="wolt-btn-primary w-100 py-3 rounded-pill fw-bold"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : 'Save Product'}
                </button>
                <button 
                    type="button"
                    className="wolt-btn-outline w-100 py-3 rounded-pill fw-bold"
                    onClick={onHide}
                    disabled={isSaving}
                >
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddProductModal;
