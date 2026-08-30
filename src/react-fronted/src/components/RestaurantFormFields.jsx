import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';

/**
 * Shared component for Restaurant form fields used in creation and editing.
 * Handles binding to formData state with Category ObjectId mapping.
 */
const RestaurantFormFields = ({ formData, setFormData }) => {
    const [availableCategories, setAvailableCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/categories`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAvailableCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Helper to extract clean ObjectId string from category object, ID string, or category name
    const getCategoryId = (c, catList = availableCategories) => {
        if (!c) return '';
        if (typeof c === 'object' && c !== null) {
            return String(c._id || c.id || '');
        }
        const str = String(c);
        // Check if str is already a category _id
        const matchById = catList.find(catObj => String(catObj._id || catObj.id) === str);
        if (matchById) return String(matchById._id || matchById.id);

        // Check if str is a category name
        const matchByName = catList.find(catObj => catObj.name && catObj.name.toLowerCase() === str.toLowerCase());
        if (matchByName) return String(matchByName._id || matchByName.id);

        return str;
    };

    // Normalize any category objects/names in formData.categories to ObjectId strings once categories are loaded
    useEffect(() => {
        if (availableCategories.length > 0 && Array.isArray(formData.categories) && formData.categories.length > 0) {
            const normalized = formData.categories.map(c => getCategoryId(c, availableCategories)).filter(Boolean);
            const currentSerialized = JSON.stringify(formData.categories);
            const normalizedSerialized = JSON.stringify(normalized);
            if (currentSerialized !== normalizedSerialized) {
                setFormData(prev => ({ ...prev, categories: normalized }));
            }
        }
    }, [availableCategories, formData.categories]);

    const isCategorySelected = (catObj) => {
        if (!Array.isArray(formData.categories)) return false;
        const targetId = getCategoryId(catObj);
        if (!targetId) return false;
        return formData.categories.some(c => getCategoryId(c) === targetId);
    };

    const handleCategoryChange = (catObj) => {
        const catId = getCategoryId(catObj);
        if (!catId) return;

        setFormData(prev => {
            const currentCats = Array.isArray(prev.categories) ? prev.categories.map(c => getCategoryId(c)).filter(Boolean) : [];
            if (currentCats.includes(catId)) {
                return { ...prev, categories: currentCats.filter(id => id !== catId) };
            } else {
                return { ...prev, categories: [...currentCats, catId] };
            }
        });
    };

    // Format selected categories into human-readable names for the dropdown toggle
    const getSelectedCategoryDisplayNames = () => {
        if (!Array.isArray(formData.categories) || formData.categories.length === 0) {
            return [];
        }
        return formData.categories.map(c => {
            if (typeof c === 'object' && c !== null && c.name) {
                return c.name;
            }
            const idStr = getCategoryId(c);
            const match = availableCategories.find(catObj => String(catObj._id || catObj.id) === idStr || catObj.name === c);
            return match ? match.name : String(c);
        });
    };

    return (
        <div className="wolt-edit-form">
            <div className="row">
                <div className="col-md-6">
                    <label className="wolt-edit-label">Restaurant Name</label>
                    <input 
                        type="text" 
                        className="wolt-modal-input" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Burger King"
                    />

                    <label className="wolt-edit-label mt-2">Phone</label>
                    <input 
                        type="text" 
                        className="wolt-modal-input" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 050-1234567"
                    />

                    <label className="wolt-edit-label mt-2">Working Hours</label>
                    <input 
                        type="text" 
                        className="wolt-modal-input" 
                        value={formData.working_hours}
                        onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                        placeholder="e.g. 09:00 - 23:00"
                    />
                    
                    <label className="wolt-edit-label mt-2 mb-2 d-block">Categories</label>
                    <Dropdown autoClose="outside" className="w-100" drop="down">
                        <Dropdown.Toggle 
                            id="dropdown-categories" 
                            className="w-100 text-start d-flex justify-content-between align-items-center wolt-modal-input"
                            variant="outline-secondary"
                        >
                            <span className="text-truncate" style={{ maxWidth: '90%' }}>
                                {getSelectedCategoryDisplayNames().length > 0 
                                    ? getSelectedCategoryDisplayNames().join(', ') 
                                    : 'Select Categories...'}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu 
                            className="w-100" 
                            popperConfig={{ modifiers: [{ name: 'flip', enabled: false }] }}
                            style={{ 
                                maxHeight: '250px', 
                                overflowY: 'auto', 
                                backgroundColor: 'var(--wolt-primary-bg)', 
                                border: '1px solid var(--wolt-muted-border)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                                zIndex: 1050
                            }}
                        >
                            {availableCategories.map(catObj => {
                                const catId = String(catObj._id || catObj.id);
                                const catName = catObj.name || catId;
                                const isChecked = isCategorySelected(catObj);
                                return (
                                    <div 
                                        key={catId} 
                                        className="dropdown-item d-flex align-items-center py-2"
                                        style={{ color: 'var(--wolt-text-primary)', backgroundColor: 'transparent' }}
                                    >
                                        <div className="form-check m-0 d-flex align-items-center w-100" style={{ cursor: 'pointer' }}>
                                            <input 
                                                className="form-check-input shadow-none m-0 me-2" 
                                                type="checkbox" 
                                                id={`dropdown-cat-${catId}`} 
                                                checked={isChecked}
                                                onChange={() => handleCategoryChange(catObj)} 
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label className="form-check-label flex-grow-1" htmlFor={`dropdown-cat-${catId}`} style={{ cursor: 'pointer' }}>
                                                {catName}
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="col-md-6">
                    <label className="wolt-edit-label">Address Latitude (X)</label>
                    <input 
                        type="number" 
                        className="wolt-modal-input" 
                        value={formData.addressX}
                        onChange={(e) => setFormData({ ...formData, addressX: e.target.value })}
                        placeholder="e.g. 32.0853"
                    />

                    <label className="wolt-edit-label mt-2">Address Longitude (Y)</label>
                    <input 
                        type="number" 
                        className="wolt-modal-input" 
                        value={formData.addressY}
                        onChange={(e) => setFormData({ ...formData, addressY: e.target.value })}
                        placeholder="e.g. 34.7818"
                    />

                    <label className="wolt-edit-label mt-2">Kosher</label>
                    <select 
                        className="wolt-modal-input" 
                        value={formData.kosher}
                        onChange={(e) => setFormData({ ...formData, kosher: e.target.value === 'true' })}
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
            </div>
            
            <label className="wolt-edit-label mt-3">Description (optional)</label>
            <textarea 
                className="wolt-modal-input w-100" 
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell customers about your restaurant..."
                style={{ resize: 'none' }}
            />
        </div>
    );
};

export default RestaurantFormFields;
