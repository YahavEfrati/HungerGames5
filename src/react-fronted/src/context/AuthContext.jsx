import React, { createContext, useState, useEffect } from 'react';
import { getEntityId } from '../utils/idUtils';

/**
 * Global Authentication Context.
 * Manages the current user session and exposes login/logout functionalities.
 */
export const AuthContext = createContext();

/**
 * Authentication Provider Component.
 * Wraps the application to provide access to the user state and authentication methods.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume this context.
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [currentLocation, setCurrentLocationState] = useState(() => {
        const savedLoc = localStorage.getItem('current_location');
        if (savedLoc) {
            try {
                return JSON.parse(savedLoc);
            } catch (error) {
                console.error("Failed to parse current_location from localStorage:", error);
            }
        }
        return null;
    });

    /**
     * Effect to check for an existing session on initial component mount.
     * Verifies the stored session with the backend.
     */
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('jwt_token');
            const userInfoStr = localStorage.getItem('user_info');

            if (token && userInfoStr) {
                try {
                    const user = JSON.parse(userInfoStr);
                    const userId = getEntityId(user);
                    if (!userId) {
                        localStorage.removeItem('jwt_token');
                        localStorage.removeItem('user_info');
                        setCurrentUser(null);
                        setIsAuthLoading(false);
                        return;
                    }

                    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const verifiedData = await response.json();
                        setCurrentUser({
                            ...verifiedData,
                            id: getEntityId(verifiedData),
                            _id: getEntityId(verifiedData)
                        });
                    } else if (response.status === 401 || response.status === 404) {
                        // In-memory DB wiped or token invalid
                        localStorage.removeItem('jwt_token');
                        localStorage.removeItem('user_info');
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error("Session verification failed:", error);
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_info');
                    setCurrentUser(null);
                }
            }
            setIsAuthLoading(false);
        };

        verifySession();
    }, []);

    /**
     * Updates the current location in state and localStorage.
     * @param {Object} location - The new coordinates object containing addressX and addressY.
     */
    const setCurrentLocation = (location) => {
        if (location) {
            localStorage.setItem('current_location', JSON.stringify(location));
        } else {
            localStorage.removeItem('current_location');
        }
        setCurrentLocationState(location);
    };

    /**
     * Logs the user into the application context.
     * Stores the session token and lightweight user object in localStorage.
     * 
     * @param {Object} userData - The authentication data returned from the API.
     * @param {string} userData.authorization - The JWT token.
     * @param {Object} userData.user - The lightweight user object.
     */
    const login = (userData) => {
        const normalizedUser = userData.user
            ? {
                ...userData.user,
                id: getEntityId(userData.user),
                _id: getEntityId(userData.user)
            }
            : null;

        localStorage.setItem('jwt_token', userData.authorization);
        localStorage.setItem('user_info', JSON.stringify(normalizedUser));
        setCurrentUser(normalizedUser);
        // Unconditionally set the current location to the user's saved coordinates on login.
        // The user can still update their location afterward via the NavBar selector.
        if (normalizedUser) {
            const userLoc = {
                addressX: normalizedUser.addressX,
                addressY: normalizedUser.addressY
            };
            localStorage.setItem('current_location', JSON.stringify(userLoc));
            setCurrentLocationState(userLoc);
        }
    };

    /**
     * Logs the user out of the application context.
     * Clears the session from localStorage and resets the state to null.
     */
    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('current_location');
        setCurrentUser(null);
        setCurrentLocationState(null);
    };

    /**
     * Updates the current user info in state and localStorage.
     * @param {Object} updatedUser - The updated user object.
     */
    const updateCurrentUser = (updatedUser) => {
        const normalizedId = getEntityId(updatedUser);
        const userObj = {
            id: normalizedId,
            _id: normalizedId,
            name: updatedUser.name,
            role: updatedUser.role,
            addressX: updatedUser.addressX,
            addressY: updatedUser.addressY,
            picture: updatedUser.picture
        };
        localStorage.setItem('user_info', JSON.stringify(userObj));
        setCurrentUser(userObj);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, currentLocation, setCurrentLocation, updateCurrentUser, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
