import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './userService';

export const TOKEN_STORAGE_KEY = 'userToken';

/**
 * Sends login credentials to the backend server and retrieves the JWT token.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The server response containing the token.
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
 * Removes the stored JWT token from AsyncStorage.
 */
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (err) {
        console.error('Failed to remove token from storage:', err);
    }
};
