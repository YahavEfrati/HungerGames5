const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');

/**
 * User Service.
 * Handles the business logic and ID generation for user operations.
 */
class UserService {
    
    /**
     * Validates user data for creation or update operations.
     * @param {Object} data - The user data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateUserData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid data format.");
        }

        const stringFields = ['username', 'password', 'name', 'phone', 'picture', 'role'];
        const numberFields = ['addressX', 'addressY'];
        const allowedFields = [...stringFields, ...numberFields];

        if (!isUpdate) {
            // For creation: all required fields must be present
            for (const field of stringFields) {
                if (data[field] === undefined || data[field] === null || typeof data[field] !== 'string' || data[field].trim() === '') {
                    throw new Error("All fields are required, including a profile picture.");
                }
            }
            for (const field of numberFields) {
                if (data[field] === undefined || data[field] === null || typeof data[field] !== 'number' || isNaN(data[field])) {
                    throw new Error("Coordinates must be valid numbers.");
                }
            }
        } else {
            // For update: only validate fields that are provided
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }
                if (stringFields.includes(field)) {
                    if (data[field] === null || typeof data[field] !== 'string' || data[field].trim() === '') {
                        throw new Error(`Invalid data for field: ${field}`);
                    }
                } else if (numberFields.includes(field)) {
                    if (data[field] === null || typeof data[field] !== 'number' || isNaN(data[field])) {
                        throw new Error(`Invalid data for field: ${field}. Must be a valid number.`);
                    }
                }
            }
        }

        // Specific password complexity validation
        if (data.password !== undefined) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(data.password)) {
                throw new Error("Password must be at least 8 characters long and contain both letters and numbers.");
            }
        }

        // Specific phone format validation
        if (data.phone !== undefined) {
            const phoneRegex = /^[0-9]+$/;
            if (!phoneRegex.test(data.phone)) {
                throw new Error("Phone number must contain only digits.");
            }
        }

        return true;
    }
    
    /**
     * Creates a new user with validation.
     * @param {Object} userData - The user data (username, password, name, phone, addressX, addressY, picture).
     * @returns {Object} The newly created user.
     * @throws {Error} If validation fails.
     */
    createUser(userData) {
        // Validate user data before creation (throws if invalid)
        this._validateUserData(userData, false);

        // Generate UUID for the new user
        const userId = uuidv4();
        const newUser = userModel.createUser({ id: userId, ...userData });
        return newUser;
    }

    getUserById(id) {
        return userModel.getUserById(id);
    }
    
    getUserByUsername(username) {
        return userModel.getUserByUsername(username);
    }
    
    // For Login - verify username and password, return user ID if valid, else null
    verifyCredentials(username, password) {
        const user = this.getUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        return user.id;
    }

    getUserRole(userId) {
        const user = this.getUserById(userId);
        return user ? user.role : null;
    }

    /**
     * Updates an existing user's details.
     * @param {string} id - The UUID of the user.
     * @param {Object} userData - User details containing fields to update.
     * @returns {Object|null} The updated user object.
     * @throws {Error} If validation fails.
     */
    updateUser(id, userData) {
        // Validate user data before update.
        // pass isUpdate = true to only validate provided fields.
        this._validateUserData(userData, true);
        return userModel.updateUser(id, userData);
    }
}

module.exports = new UserService();