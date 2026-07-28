/**
 * Authentication Service.
 * Handles all HTTP requests related to user authentication against the Node.js server.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Sends login credentials to the server and retrieves the JWT token.
 * * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The server response containing the token.
 * @throws {Error} If the login fails (e.g., wrong credentials).
 */
export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }

    return await response.json(); 
};