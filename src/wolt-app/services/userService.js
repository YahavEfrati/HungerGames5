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
