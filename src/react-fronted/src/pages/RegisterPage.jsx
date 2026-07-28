import React, { useState, useContext, useEffect } from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import { Form, Button, Alert, OverlayTrigger, Popover, Row, Col } from 'react-bootstrap';
import AuthLayout from '../layouts/AuthLayout';
import { registerUser } from '../services/createUserService';
import { AuthContext } from '../context/AuthContext';
import '../styles/WoltTheme.css';
import './LoginPage.css'; // Reusing the same core styles
import './RegisterPage.css'; // Specific tweaks for register.

/**
 * Registration Page Component.
 * Handles user sign-up with strict password and form validations.
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Consume AuthContext to protect route
    const { currentUser } = useContext(AuthContext);

    // Protect auth route from logged-in users
    useEffect(() => {
        if (currentUser) {
            navigate('/', { replace: true });
        }
    }, [currentUser, navigate]);


    // Form states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressX, setAddressX] = useState('');
    const [addressY, setAddressY] = useState('');
    const [picture, setPicture] = useState(null);

    // UI and Validation states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validated, setValidated] = useState(false);


    /**
     * Validates if the password meets the complexity requirements.
     * @param {string} pass - The password to check.
     * @returns {boolean} True if valid, false otherwise.
     */
    const isPasswordComplex = (pass) => {
        // Regex: At least 8 chars, contains at least one letter and one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(pass);
    };

    const isPhoneValid = (phone) => {
        // Simple regex to check if phone contains only digits (you can enhance this as needed)
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phone);
    };


    /**
     * Handles the form submission event.
     * @param {Event} e - The DOM event triggered by the form.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        // 1. Basic HTML5 validation check (empty fields)
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        // 2. Custom Validation: Password Complexity
        if (!isPasswordComplex(password)) {
            setError('Password must be at least 8 characters long and contain both letters and numbers.');
            setSuccess('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 3. Custom Validation: Passwords Match
        if (password !== verifyPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!isPhoneValid(phone)) {
            setError('Phone number must contain only digits.');
            setSuccess('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 4. Custom Validation: Picture uploaded
        if (!picture) {
            setError('Please select a profile picture.');
            setSuccess('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError('');
        setSuccess('');

        // Find which button triggered the submission to get the user's role
        const submitter = e.nativeEvent.submitter;
        const selectedRole = submitter ? submitter.getAttribute('data-role') : 'user';

        try {
            // Build the user data object including the selected role
            const userData = { 
                username, 
                password, 
                name, 
                phone, 
                addressX, 
                addressY, 
                role: selectedRole 
            };
            
            // Call the service
            await registerUser(userData, picture);
            
            console.log("Registration successful!");
            
            // Clear all form fields upon successful registration
            setValidated(false);
            setUsername('');
            setPassword('');
            setVerifyPassword('');
            setName('');
            setPhone('');
            setAddressX('');
            setAddressY('');
            setPicture(null);
            
            // Ensure any existing error is cleared
            setError('');
            
            // Navigate instantly to login and pass the success message via Router state
            navigate('/login', { 
                state: { 
                    ...location.state,
                    successMessage: 'Registration successful, please log in' 
                } 
            });
        } catch (err) {
            // Displays server errors (like duplicate username) to the user
            setError(err.message);
            setSuccess('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Popover component to display password requirements elegantly.
     * Styled to match the dark theme of the application.
     */
    const passwordRequirementsPopover = (
        <Popover id="popover-password-requirements">
            <Popover.Header as="h6" className="bg-dark text-warning border-secondary mb-0">
                Password must include:
            </Popover.Header>
            <Popover.Body className="bg-dark text-white">
                <ul className="list-unstyled mb-0 small">
                    <li>• At least 8 characters</li>
                    <li>• One uppercase letter</li>
                    <li>• One lowercase letter</li>
                    <li>• One number</li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <AuthLayout>
            
            <h1 className="text-white text-center mb-4 fw-bold mt-4">HungerGames</h1>
            
            <div className="register-header-container">
                <button 
                    type="button" 
                    className="back-to-login-btn position-absolute start-0"
                    onClick={() => navigate('/')}
                    aria-label="Back to login"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h3 className="text-white text-center mb-0 fw-bold">Register To HungerGames!</h3>
            </div>
            
            <div className="register-form-width">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                
                <Form noValidate validated={validated} onSubmit={handleRegister}>
                    

                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label className="text-white">Username</Form.Label>
                        <Form.Control 
                                    type="text"
                                    className="login-dark-input" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formPassword">
                        <div className="d-flex justify-content-between align-items-center">
                            <Form.Label className="text-white mb-0">Password</Form.Label>
                            
                            <OverlayTrigger 
                                trigger={['hover', 'focus']} 
                                placement="top" 
                                overlay={passwordRequirementsPopover}
                            >
                                <span className="text-info" style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                    </svg>
                                </span>
                            </OverlayTrigger>
                        </div>
                        <Form.Control 
                            type="password"
                            className="login-dark-input mt-1" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must meet the requirements
                        </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formVerifyPassword">
                        <Form.Label className="text-white">Verify Password</Form.Label>
                        <Form.Control 
                                    type="password"
                                    className="login-dark-input" 
                                    value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label className="text-white">Full Name</Form.Label>
                        <Form.Control 
                                    type="text"
                                    className="login-dark-input" 
                                    value={name} onChange={(e) => setName(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Full Name is required</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label className="text-white">Phone</Form.Label>
                        <Form.Control 
                                    type="tel"
                                    className="login-dark-input" 
                                    value={phone} onChange={(e) => setPhone(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Phone is required</Form.Control.Feedback>
                    </Form.Group>



                    <Form.Group className="mb-3" controlId="formAddress">
                        <Form.Label className="text-white">Address Latitude (X)</Form.Label>
                        <Form.Control 
                            type="number"
                            className="login-dark-input" 
                            value={addressX} onChange={(e) => setAddressX(e.target.value)} 
                            required />
                        <Form.Control.Feedback type="invalid">Latitude is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formAddressY">
                        <Form.Label className="text-white">Address Longitude (Y)</Form.Label>
                        <Form.Control 
                            type="number"
                            className="login-dark-input" 
                            value={addressY} onChange={(e) => setAddressY(e.target.value)} 
                            required />
                        <Form.Control.Feedback type="invalid">Longitude is required</Form.Control.Feedback>
                    </Form.Group>


                   {/* Profile Picture Upload - Hidden input triggered by clicking the avatar placeholder */}
                    <Form.Group className="mb-4 text-center">
                        <Form.Label className="text-white d-block mb-3 fw-bold">Profile Picture</Form.Label>
                        
                        <label htmlFor="formPictureInput" className="avatar-upload-container mx-auto" style={{ cursor: 'pointer' }}>
                            {picture ? (
                                // Render the selected image preview
                                <img 
                                    src={URL.createObjectURL(picture)} 
                                    alt="Profile Preview" 
                                    className="avatar-image"
                                />
                            ) : (
                                // Render the default placeholder with an upload badge
                                <div className="avatar-placeholder">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="default-user-icon">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <div className="upload-badge">+</div>
                                </div>
                            )}
                        </label>

                        {/* The actual file input is hidden using Bootstrap's d-none class */}
                        <Form.Control 
                            id="formPictureInput"
                            type="file" 
                            accept="image/*"
                            className="d-none" 
                            onChange={(e) => setPicture(e.target.files[0])} 
                            required 
                        />
                        
                        {/* Manual validation feedback since the input itself is hidden */}
                        {!picture && validated && (
                            <div className="text-danger mt-2 small">Please select an image</div>
                        )}
                    </Form.Group>
                    
                    {/* Submit as Customer Button */}
                    <Button 
                        type="submit" 
                        data-role="customer" 
                        className="w-100 primary-btn rounded-pill mt-2"
                    >
                        Register as Customer
                    </Button>
                    
                    {/* Submit as Restaurant Owner Button */}
                    <Button 
                        type="submit" 
                        data-role="restaurant_owner" 
                        className="w-100 secondary-btn rounded-pill mt-3 mb-4"
                    >
                        Register as Restaurant Owner
                    </Button>
                </Form>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
