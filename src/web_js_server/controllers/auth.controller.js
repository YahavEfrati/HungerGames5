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
    login(req, res) {
        const { username, password } = req.body;

        // Ensure both fields are present
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Delegate the verification logic to the User Service
        const userId = userService.verifyCredentials(username, password);

        // If invalid - return Error 400
        if (!userId) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const user = userService.getUserById(userId);

        // JWT Logic:
        // 1. Create the payload (the data we want to encode inside the token)
        const payload = {
            id: user.id,
            role: user.role
        };

        // 2. Sign the token with a secret key and set an expiration time - 24 hours
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'default_secret', 
            { expiresIn: '24h' }
        );

        // Returns the token and lightweight user object
        return res.status(201).json({ 
            authorization: token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                addressX: user.addressX,
                addressY: user.addressY,
                picture: user.picture
            }
        });
    }
}

module.exports = new AuthController();