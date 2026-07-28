import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spinner, Alert } from 'react-bootstrap';
import { addRestaurant } from '../services/restaurantService';
import '../pages/ProductModal.css'; // Reusing styles
import RestaurantFormFields from './RestaurantFormFields';
import { isEmpty } from '../utils/validationUtils';

const AddRestaurantModal = ({ show, onHide, onRestaurantAdded }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        phone: '', 
        addressX: '', 
        addressY: '', 
        kosher: false, 
        working_hours: '',
        categories: [],
        image: '' 
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setFormData({ 
                name: '', 
                description: '', 
                phone: '', 
                addressX: '', 
                addressY: '', 
                kosher: false, 
                working_hours: '',
                categories: [],
                image: '' 
            });
            setError(null);
            setIsDragging(false);
        }
    }, [show]);

    const isFormValid = !isEmpty(formData.name) && 
                        !isEmpty(formData.phone) && 
                        !isEmpty(formData.addressX) && 
                        !isEmpty(formData.addressY) && 
                        !isEmpty(formData.working_hours) && 
                        !isEmpty(formData.image);

    const handleSave = async () => {
        if (!isFormValid) {
            setError('Please fill out all required fields and upload an image.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            

            const newRest = await addRestaurant({
                name: formData.name.trim(),
                description: formData.description.trim(),
                phone: formData.phone.trim(),
                addressX: Number(formData.addressX),
                addressY: Number(formData.addressY),
                kosher: formData.kosher,
                working_hours: formData.working_hours.trim(),
                categories: formData.categories,
                image: formData.image.trim()
            });
            
            onHide();
            if (onRestaurantAdded) {
                onRestaurantAdded(newRest);
            }
        } catch (err) {
            setError(err.message || 'Failed to add new restaurant');
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
        <Modal show={show} onHide={onHide} centered contentClassName="wolt-modal-content" size="lg">
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
                        <p className="upload-text">Drag & drop cover image here or click to upload</p>
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
                <RestaurantFormFields formData={formData} setFormData={setFormData} />
            </Modal.Body>
            
            <Modal.Footer className="wolt-modal-footer flex-column gap-2">
                {error && <Alert variant="danger" className="w-100 mb-2">{error}</Alert>}
                <button 
                    type="button"
                    className="wolt-btn-primary w-100 py-3 rounded-pill fw-bold"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : 'Save Restaurant'}
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

export default AddRestaurantModal;
