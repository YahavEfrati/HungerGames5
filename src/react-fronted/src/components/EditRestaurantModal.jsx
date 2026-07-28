import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spinner, Alert, Button } from 'react-bootstrap';
import { updateRestaurant, deleteRestaurant } from '../services/restaurantService';
import '../pages/ProductModal.css';
import RestaurantFormFields from './RestaurantFormFields';
import { isEmpty } from '../utils/validationUtils';

const EditRestaurantModal = ({ show, onHide, restaurant, onRestaurantUpdate }) => {
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (restaurant && show) {
            setFormData({ 
                name: restaurant.name || '', 
                description: restaurant.description || '', 
                phone: restaurant.phone || '', 
                addressX: restaurant.addressX || '', 
                addressY: restaurant.addressY || '', 
                kosher: restaurant.kosher || false, 
                working_hours: restaurant.working_hours || '',
                categories: restaurant.categories && Array.isArray(restaurant.categories) ? restaurant.categories : [],
                image: restaurant.image || '' 
            });
            setError(null);
            setIsDragging(false);
            setShowDeleteConfirm(false);
        }
    }, [restaurant, show]);

    if (!restaurant) return null;

    const isDirty = 
        formData.name !== restaurant.name || 
        formData.phone !== restaurant.phone ||
        String(formData.addressX) !== String(restaurant.addressX || '') ||
        String(formData.addressY) !== String(restaurant.addressY || '') ||
        formData.description !== restaurant.description ||
        formData.working_hours !== restaurant.working_hours ||
        formData.kosher !== restaurant.kosher ||
        JSON.stringify(formData.categories) !== JSON.stringify(restaurant.categories ? restaurant.categories : []) ||
        formData.image !== restaurant.image;

    const handleSave = async () => {
        if (!isDirty) {
            onHide();
            return;
        }

        // Validate mandatory fields using a robust check

        if (isEmpty(formData.name) || 
            isEmpty(formData.phone) || 
            isEmpty(formData.addressX) || 
            isEmpty(formData.addressY) || 
            isEmpty(formData.working_hours) || 
            isEmpty(formData.image)) {
            setError('Please fill out all mandatory fields: name, phone, coordinates, working hours, and image.');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);


            const updatedRestData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                phone: formData.phone.trim(),
                addressX: Number(formData.addressX),
                addressY: Number(formData.addressY),
                kosher: formData.kosher,
                working_hours: formData.working_hours.trim(),
                categories: formData.categories,
                image: formData.image.trim()
            };

            const updatedRest = await updateRestaurant(restaurant.id, updatedRestData);
            
            onHide();
            if (onRestaurantUpdate) {
                onRestaurantUpdate('update', updatedRest || { ...restaurant, ...updatedRestData });
            }
        } catch (err) {
            setError(err.message || 'Failed to update restaurant');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            await deleteRestaurant(restaurant.id);
            onHide();
            if (onRestaurantUpdate) {
                onRestaurantUpdate('delete');
            }
        } catch (err) {
            setError(err.message || 'Failed to delete restaurant');
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
        <>
        <Modal show={show && !showDeleteConfirm} onHide={onHide} centered contentClassName="wolt-modal-content" size="lg">
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
                        <p className="upload-text">Drag & drop new cover image here or click to upload</p>
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
                    className={`wolt-modal-action-btn ${!isDirty ? 'btn-secondary' : 'btn-primary'} w-100`}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : (isDirty ? 'Save Changes' : 'Cancel')}
                </button>
                <button 
                    type="button"
                    className="wolt-modal-action-btn wolt-modal-action-btn-danger w-100"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSaving}
                >
                    Delete Restaurant
                </button>
            </Modal.Footer>
        </Modal>

        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered contentClassName="wolt-modal-content">
            <Modal.Body className="wolt-modal-body text-center p-5">
                <div className="mb-4" style={{ fontSize: '3rem' }}>🗑️</div>
                <h3 className="wolt-modal-title mb-3">Delete Restaurant?</h3>
                <p className="wolt-modal-desc mb-4">Are you sure you want to permanently delete <strong>{restaurant.name}</strong>? This action cannot be undone and will delete all products.</p>
                <div className="d-flex flex-column gap-3 w-100">
                    <Button 
                        variant="danger" 
                        className="w-100 py-3 fw-bold rounded-3" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Spinner size="sm" animation="border" /> : 'Yes, Delete Restaurant'}
                    </Button>
                    <Button 
                        variant="light" 
                        className="wolt-btn-outline w-100 py-3 fw-bold rounded-3" 
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

export default EditRestaurantModal;
