import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './userService';

export const TOKEN_STORAGE_KEY = 'userToken';
export const USER_STORAGE_KEY = 'userInfo';

/**
 * Sends login credentials to the backend server and retrieves the JWT token and user info.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The server response containing authorization token and user info.
 */
export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username ? username.trim() : '',
            password: password,
        }),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'password or username is incorrect, please try again.');
    }

    return responseData;
};

/**
 * Saves the JWT token to AsyncStorage under key 'userToken'.
 * @param {string} token - The JWT token string.
 */
export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (err) {
        console.error('Failed to save token to storage:', err);
        throw err;
    }
};

/**
 * Saves the user details object to AsyncStorage under key 'userInfo'.
 * @param {Object} user - The user object.
 */
export const saveUser = async (user) => {
    try {
        if (user) {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
    } catch (err) {
        console.error('Failed to save user info to storage:', err);
    }
};

/**
 * Retrieves the stored JWT token from AsyncStorage.
 * @returns {Promise<string|null>} The stored JWT token or null.
 */
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (err) {
        console.error('Failed to get token from storage:', err);
        return null;
    }
};

/**
 * Retrieves the stored user details object from AsyncStorage.
 * @returns {Promise<Object|null>} The stored user object or null.
 */
export const getUser = async () => {
    try {
        const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
        return userStr ? JSON.parse(userStr) : null;
    } catch (err) {
        console.error('Failed to get user info from storage:', err);
        return null;
    }
};

/**
 * Removes the stored JWT token and user details from AsyncStorage.
 */
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (err) {
        console.error('Failed to remove token from storage:', err);
    }
};

/**
 * Helper function to generate authorization headers with JWT token.
 * @returns {Promise<Object>} Headers object with Content-Type and Authorization (if logged in).
 */
export const getAuthHeaders = async () => {
    const token = await getToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

