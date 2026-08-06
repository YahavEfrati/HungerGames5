const userModel = require('../models/user.model');

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
     */
    async createUser(userData) {
        this._validateUserData(userData, false);

        const existingUser = await userModel.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error("Username already exists.");
        }

        const newUser = await userModel.create(userData);
        return newUser;
    }

    async getUserById(id) {
        return await userModel.findById(id);
    }
    
    async getUserByUsername(username) {
        return await userModel.findOne({ username: username });
    }
    
    // For Login - verify username and password, return user ID if valid, else null
    async verifyCredentials(username, password) {
        const user = await this.getUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        return user._id.toString(); 
    }

    async getUserRole(userId) {
        const user = await this.getUserById(userId);
        return user ? user.role : null;
    }

    /**
     * Updates an existing user's details.
     */
    async updateUser(id, userData) {
        delete userData.username; // Prevent username changes
        this._validateUserData(userData, true);
        
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            userData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            throw new Error("User not found.");
        }
        
        return updatedUser;
    }
}

module.exports = new UserService();