import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Gets the backend API base URL based on the environment and platform.
 * On Android emulator, 'localhost' points to the emulator itself, so 10.0.2.2 is used.
 */
const getBaseUrl = () => {
    // If debuggerHost or hostUri is available from Expo, extract host IP
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.extra?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        if (ip) {
            return `http://${ip}:3000/api`;
        }
    }
    
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3000/api';
    }
    
    return 'http://localhost:3000/api';
};

export const API_URL = getBaseUrl();

/**
 * Registers a new user with the provided data.
 * @param {*} userData - The user data for registration.
 * @returns {Promise<Object>} - A promise resolving to the registration response.
 */
export const registerUser = async (userData) => {
    const payload = {
        username: userData.username ? userData.username.trim() : '',
        password: userData.password,
        name: userData.name ? userData.name.trim() : '',
        phone: userData.phone ? userData.phone.trim() : '',
        addressX: parseFloat(userData.addressX),
        addressY: parseFloat(userData.addressY),
        role: userData.role || 'customer',
        picture: userData.picture,
    };

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Registration failed');
    }

    return responseData;
};

/**
 * Fetches user profile data from backend using stored JWT token and userId.
 * @param {string} token - The JWT token string.
 * @param {string} userId - The user ID string.
 * @returns {Promise<Object>} - User profile object.
 */
export const getUserProfile = async (token, userId) => {
    if (!token) {
        throw new Error('No authentication token provided');
    }
    if (!userId) {
        throw new Error('No user ID provided');
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const responseData = await response.json();

    if (!response.ok) {
        const error = new Error(responseData.error || responseData.message || 'Failed to fetch user profile');
        error.status = response.status;
        throw error;
    }

    return responseData;
};

/**
 * Updates user profile data on backend.
 * @param {string} token - The JWT token string.
 * @param {string} userId - The user ID string.
 * @param {Object} updateData - Object containing name, phone, addressX, addressY, picture.
 * @returns {Promise<Object>} - Updated user profile object.
 */
export const updateUserProfile = async (token, userId, updateData) => {
    if (!token) {
        throw new Error('No authentication token provided');
    }
    if (!userId) {
        throw new Error('No user ID provided');
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    const responseData = await response.json();

    if (!response.ok) {
        const error = new Error(responseData.error || responseData.message || 'Failed to update user profile');
        error.status = response.status;
        throw error;
    }

    return responseData;
};
