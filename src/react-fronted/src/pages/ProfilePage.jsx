import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './ProfilePage.css';

/**
 * Helper function to convert a physical File object into a Base64 encoded string.
 * This matches the pattern implemented in RegisterPage.jsx.
 * 
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<string>} A promise that resolves with the Base64 string.
 */
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Profile Page Component.
 * Allows logged-in users to view and update their profile details (Name, Phone, Coordinates, Avatar).
 * Dynamically supports Light and Dark modes.
 */
const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser, updateCurrentUser, logout, isAuthLoading } = useContext(AuthContext);

    // Form inputs and page states
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressX, setAddressX] = useState('');
    const [addressY, setAddressY] = useState('');

    // Picture selection and preview states
    const [pictureFile, setPictureFile] = useState(null);
    const [picturePreview, setPicturePreview] = useState('');

    // UI flags
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthLoading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, isAuthLoading, navigate]);

    // Fetch user details from backend on component mount
    useEffect(() => {
        if (!currentUser) return;

        const fetchUserProfile = async () => {
            const token = localStorage.getItem('jwt_token');
            try {
                const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 404) {
                        logout();
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile details');
                }

                const userData = await response.json();
                setUsername(userData.username || '');
                setName(userData.name || '');
                setPhone(userData.phone || '');
                setAddressX(userData.addressX !== undefined ? userData.addressX : '');
                setAddressY(userData.addressY !== undefined ? userData.addressY : '');
                setPicturePreview(userData.picture || '');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser, logout, navigate]);

    /**
     * Handles file input selection.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPictureFile(file);
            setPicturePreview(URL.createObjectURL(file));
        }
    };

    /**
     * Handles switching to edit mode or submitting changes.
     */
    const handleActionClick = async (e) => {
        e.preventDefault();

        // If not in Edit Mode, simply unlock fields
        if (!isEditMode) {
            setIsEditMode(true);
            setSuccess('');
            setError('');
            return;
        }

        // Validate form fields
        const form = e.currentTarget.form || e.currentTarget;
        setValidated(true);

        if (form && form.checkValidity() === false) {
            setError('Please correct the validation errors below.');
            return;
        }

        // Phone format validation (digits only)
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            setError('Phone number must contain only digits.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            let base64Picture = picturePreview;

            // If a new picture file was selected, convert it to Base64
            if (pictureFile) {
                base64Picture = await convertFileToBase64(pictureFile);
            }

            const payload = {
                name,
                phone,
                addressX: parseFloat(addressX),
                addressY: parseFloat(addressY),
                picture: base64Picture
            };

            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 404) {
                    logout();
                    navigate('/login');
                    return;
                }
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to update profile');
            }

            const updatedUser = await response.json();

            // Sync updated profile to global AuthContext state and localStorage
            updateCurrentUser(updatedUser);
            setIsEditMode(false);
            setValidated(false);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <h4 className="text-muted">Loading Profile...</h4>
            </Container>
        );
    }

    return (
        <Container className="py-4 mt-5">
            {/* Go Back button */}
            <div className="back-btn-container">
                <Button className="profile-back-btn" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="profile-card">
                        <h2 className="text-center mb-4 fw-bold">My Profile</h2>

                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                        {success && <Alert variant="success" className="text-center">{success}</Alert>}

                        <Form noValidate validated={validated}>
                            {/* Larger profile picture top center */}
                            <div className="avatar-container">
                                <label 
                                    htmlFor="formPictureInput" 
                                    className={`avatar-upload-label ${isEditMode ? 'clickable' : ''}`}
                                >
                                    {picturePreview ? (
                                        <img 
                                            src={picturePreview} 
                                            alt="Profile" 
                                            className="avatar-image"
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="default-user-icon">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        </div>
                                    )}
                                    {isEditMode && <div className="upload-badge">+</div>}
                                </label>
                                <Form.Control 
                                    id="formPictureInput"
                                    type="file" 
                                    accept="image/*"
                                    className="d-none" 
                                    onChange={handleFileChange}
                                    disabled={!isEditMode}
                                />
                            </div>

                            {/* Username field (Permanently disabled) */}
                            <Form.Group className="mb-3" controlId="profileUsername">
                                <Form.Label className="fw-semibold">Username</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="profile-input"
                                    value={username}
                                    disabled
                                />
                            </Form.Group>

                            {/* Full Name field */}
                            <Form.Group className="mb-3" controlId="profileName">
                                <Form.Label className="fw-semibold">Full Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="profile-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditMode}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Full Name is required</Form.Control.Feedback>
                            </Form.Group>

                            {/* Phone field */}
                            <Form.Group className="mb-3" controlId="profilePhone">
                                <Form.Label className="fw-semibold">Phone</Form.Label>
                                <Form.Control 
                                    type="tel" 
                                    className="profile-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={!isEditMode}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Phone is required</Form.Control.Feedback>
                            </Form.Group>

                            {/* Coordinates Row */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="profileAddressX">
                                        <Form.Label className="fw-semibold">Address X</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            step="any"
                                            className="profile-input"
                                            value={addressX}
                                            onChange={(e) => setAddressX(e.target.value)}
                                            disabled={!isEditMode}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Address X is required</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="profileAddressY">
                                        <Form.Label className="fw-semibold">Address Y</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            step="any"
                                            className="profile-input"
                                            value={addressY}
                                            onChange={(e) => setAddressY(e.target.value)}
                                            disabled={!isEditMode}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Address Y is required</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Action Button: Edit / Save */}
                            <Button 
                                type="button"
                                className="w-100 primary-btn rounded-pill py-2"
                                onClick={handleActionClick}
                            >
                                {isEditMode ? 'Save' : 'Edit'}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
