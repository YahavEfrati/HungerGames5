const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

/**
 * Auth Controller.
 * Handles authentication and token generation endpoints.
 */
class AuthController {
    
    /**
     * Handles the login request.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async login(req, res) {
        const { username, password } = req.body;

        // Ensure both fields are present
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        try {
            // Delegate the verification logic to the User Service (Added await)
            const userId = await userService.verifyCredentials(username, password);

            // If invalid - return Error 400
            if (!userId) {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // Added await
            const user = await userService.getUserById(userId);
            
            // Just in case the user was deleted between verification and fetching
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // JWT Logic:
            // 1. Create the payload (Note: changed user.id to user._id)
            const payload = {
                id: user._id,
                _id: user._id,
                role: user.role
            };

            // 2. Sign the token with a secret key and set an expiration time - 24 hours
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'default_secret', 
                { expiresIn: '24h' }
            );

            // Returns the token and lightweight user object
            // Note: changed user.id to user._id
            return res.status(201).json({ 
                authorization: token,
                user: {
                    id: user._id,
                    _id: user._id,
                    name: user.name,
                    role: user.role,
                    addressX: user.addressX,
                    addressY: user.addressY,
                    picture: user.picture
                }
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error during login" });
        }
    }
}

module.exports = new AuthController();