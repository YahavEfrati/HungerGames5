const userService = require('../services/user.service');

/**
 * User Controller.
 * Handles incoming HTTP requests, validates input, and formats HTTP responses for users.
 */
class UserController {
    
    /**
     * Handles the creation of a new user (Registration).
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    createUser(req, res) {
        const { username, password, name, phone, addressX, addressY, role, picture } = req.body;
        
        // Parse coordinates to floats (Service expects numbers)
        const parsedAddressX = parseFloat(addressX);
        const parsedAddressY = parseFloat(addressY);
        
        // Check if username is already taken
        const existingUser = userService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        
        try {
            // Create the new user using the service (Validation is completely handled by the service layer)
            const newUser = userService.createUser({ 
                username, password, name, phone, 
                addressX: parsedAddressX, 
                addressY: parsedAddressY, 
                role, picture 
            });
            
            // Return 201 Created with Location header pointing to the new resource and a valid JSON body
            return res.status(201)
                .location(`/api/users/${newUser.id}`)
                .json({ 
                    message: "User registered successfully", 
                    id: newUser.id,
                    username: newUser.username 
                });
        } catch (error) {
            // Return validation errors thrown by the service
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Retrieves a single user by their ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getUserById(req, res) {
        const userIdFromToken = req.user.id;
        const requestedUserId = req.params.id;

        // Ensure users can only fetch their own profile
        if( requestedUserId !== userIdFromToken) { 
            return res.status(403).json({ error: "Forbidden: You can only access your own user data" });
        }

        const user = userService.getUserById(requestedUserId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }   
        return res.status(200).json(user);
    }

    /**
     * Retrieves a single user by their user name. (Will be needed later for login)
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getUserByUsername(req, res) {
        const username = req.params.username;
        const user = userService.getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }   
        return res.status(200).json(user);
    }

    /**
     * Updates an existing user's details.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    updateUser(req, res) {
        const userIdFromToken = req.user.id;
        const requestedUserId = req.params.id;

        // Ensure users can only update their own profile details
        if (requestedUserId !== userIdFromToken) {
            return res.status(403).json({ error: "Forbidden: You can only update your own user data" });
        }

        const { name, phone, addressX, addressY, picture } = req.body;

        try {
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (addressX !== undefined) updateData.addressX = parseFloat(addressX);
            if (addressY !== undefined) updateData.addressY = parseFloat(addressY);
            if (picture !== undefined) updateData.picture = picture;

            const updatedUser = userService.updateUser(requestedUserId, updateData);
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

}

// Export a singleton instance of the controller
module.exports = new UserController();