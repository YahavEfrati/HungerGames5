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
    async createUser(req, res) {
        const { username, password, name, phone, addressX, addressY, role, picture } = req.body;
        
        const parsedAddressX = parseFloat(addressX);
        const parsedAddressY = parseFloat(addressY);
        
        try {
            // Check if username is already taken (Added await and moved inside try/catch)
            const existingUser = await userService.getUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists" });
            }
            
            // Create the new user using the service
            const newUser = await userService.createUser({ 
                username, password, name, phone, 
                addressX: parsedAddressX, 
                addressY: parsedAddressY, 
                role, picture 
            });
            
            // Return 201 Created with Location header pointing to the new resource
            return res.status(201)
                .location(`/api/users/${newUser._id}`)
                .json({ 
                    message: "User registered successfully", 
                    id: newUser._id,
                    username: newUser.username 
                });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Retrieves a single user by their ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getUserById(req, res) {
        try {
            const userIdFromToken = req.user.id;
            const requestedUserId = req.params.id;

            // Ensure users can only fetch their own profile
            if( requestedUserId !== userIdFromToken) { 
                return res.status(403).json({ error: "Forbidden: You can only access your own user data" });
            }

            const user = await userService.getUserById(requestedUserId);
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }   
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * Retrieves a single user by their user name. (Will be needed later for login)
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getUserByUsername(req, res) {
        try {
            const username = req.params.username;

            const user = await userService.getUserByUsername(username);
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }   
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * Updates an existing user's details.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async updateUser(req, res) {
        const userIdFromToken = req.user.id;
        const requestedUserId = req.params.id;

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

            const updatedUser = await userService.updateUser(requestedUserId, updateData);
            
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