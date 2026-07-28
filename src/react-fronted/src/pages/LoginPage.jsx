import React, { useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../services/authService';
import { useLocation , useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

// Import the ready-made components from react-bootstrap
import { Form, Button, Alert } from 'react-bootstrap';
import '../styles/WoltTheme.css'; // Import the global Wolt theme
import './LoginPage.css';

/**
 * Login Page Component.
 * Styled beautifully with React-Bootstrap.
 */
const LoginPage = () => {
    //Set states for the form inputs, error message, and validation status
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    // Consume the AuthContext
    const { login, currentUser } = useContext(AuthContext);

   //React Router's navigation hook to programmatically navigate to different routes.
   const navigate = useNavigate();

    // Protect auth route from logged-in users
    useEffect(() => {
        if (currentUser) {
            navigate('/', { replace: true });
        }
    }, [currentUser, navigate]);
   const location = useLocation();

   const targetPath = location.state?.from || '/'; // Default to home page if no specific target path is provided
   const relayMessage = location.state?.message; // Extract relay message from state
    const [success, setSuccess] = useState('');

    /**
     * Effect to catch incoming success messages from router state (e.g., from registration).
     */
    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccess(location.state.successMessage);
            setError(''); // Clear any existing errors
            
            // Clear the router state so the message doesn't persist if the user refreshes the page
            window.history.replaceState({}, document.title); 
        }
    }, [location.state]);

    /**
     * Helper to show an error message and clear success.
     * Ensures mutually exclusive alerts.
     */
    const displayError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    /**
     * Helper to show a success message and clear error.
     * Ensures mutually exclusive alerts.
     */
    const displaySuccess = (msg) => {
        setSuccess(msg);
        setError('');
    };
    /**
     * Handles the form submission event.
     * @param {Event} e - The default form submission event.
     */
    const handleLogin = async (e) => {
        // Prevent the default form submission behavior (page reload)
        e.preventDefault(); 
        
        const form = e.currentTarget;
        // Check if the user has filled both fields. If not, show validation errors.
        if (form.checkValidity() === false) {
            e.stopPropagation(); 
            setValidated(true);  
            return; 
        }

        setError(''); 
        setSuccess('');

        try {
            const data = await loginApi(username, password);
            
            // Use the global context login function
            login(data);
            
            console.log("Login successful!");
            
            // Clear form fields upon successful login
            setUsername('');
            setPassword('');
            
            navigate(targetPath, { replace: true }); // Navigate to the target path after successful login
        } catch (err) {
            displayError("password or username is incorrect, please try again.");
        }
    };
    return (
        <AuthLayout title="HungerGames" subtitle="Login to your Hunger Games account">
            
            {/* Display relayed informational messages if they exist */}
            {relayMessage && (
                <Alert variant="info" className="w-100 text-center bg-dark text-info border-info">
                    {relayMessage}
                </Alert>
            )}

            {/* Display success messages in a green box if they exist */}
            {success && (
                <Alert variant="success" className="w-100 text-center">
                    {success}
                </Alert>
            )}
            
            {error && <Alert variant="danger" className="w-100 text-center ">
                {error}
                </Alert>
                }
            
            <Form noValidate validated={validated} onSubmit={handleLogin} className="w-100 login-form-width">
                
                {/* Username Input */}
                <Form.Group className="mb-4" controlId="formUsername">
                    {/* Label is styled to be white and right-aligned if needed */}
                    <Form.Label className="text-white">Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        className="login-dark-input"
                        placeholder="Enter username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        please enter a user name
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        className="login-dark-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        please enter a password
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Button type="submit" className="w-100 primary-btn">
                   Login
                </Button>

                <Button type="button" className="w-100 mt-3 secondary-btn"
                onClick={() => navigate('/register', { state: location.state })}>
                   Create Account
                </Button>

                <Button type="button" variant="link" className="w-100 mt-2 text-white text-decoration-none"
                onClick={() => navigate('/')}>
                   Continue as Guest
                </Button>
            </Form>
        </AuthLayout>
    );
};

export default LoginPage;