const jwt = require('jsonwebtoken');
const restaurantService = require('../services/restaurant.service');
const userService = require('../services/user.service');

/**
 * Authentication Middleware (Strict).
 * Intercepts incoming requests to verify the JWT token.
 * If invalid or missing, returns a 401/403 error and stops the request.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }
    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    try {
        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        
        // STRICT CHECK: Ensure the user still exists in the in-memory DB
        const userExists = userService.getUserById(decoded.id);
        if (!userExists) {
            return res.status(401).json({ error: 'Unauthorized: User no longer exists in database' });
        }

        req.user = { 
            id: decoded.id,
            role: decoded.role 
        };

        next();

    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
};

/**
 * Optional Authentication Middleware (Soft).
 * Checks for a JWT token. If valid, attaches user to req.
 * If missing or invalid, it simply proceeds as a guest (req.user = null) without throwing an error.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the header exists and is formatted correctly
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        try {
            // Attempt to verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
            
            // STRICT CHECK: Ensure the user still exists in the in-memory DB
            const userExists = userService.getUserById(decoded.id);
            if (!userExists) {
                req.user = null;
            } else {
                req.user = { 
                    id: decoded.id,
                    role: decoded.role 
                };
            }
        } catch (error) {
            // Token is invalid/expired, but we don't block the request. Treat as guest.
            req.user = null;
        }
    } else {
        // No token provided at all. Treat as guest.
        req.user = null;
    }
    // Always proceed to the next step
    next();
};


/** 
 * Restaurant Owner Authorization Middleware.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const requireRestaurantOwner = (req, res, next) => {
    // req.user was attached by the previous requireAuth middleware
    if (req.user && req.user.role === 'restaurant_owner') {
        next(); // User is restaurant_owner, let them proceed
    } else {
        return res.status(403).json({ error: 'Forbidden: Restaurant owner access required' });
    }
};

/** 
 * Restaurant Ownership Validation Middleware.
 * Ensures that the restaurant_owner actually owns the restaurant they are trying to modify.
 */
const requireRestaurantOwnership = (req, res, next) => {
    const restaurantId = req.params.id; // Assuming restaurant ID is in the URL as :id

    if (!restaurantId) {
        return res.status(400).json({ error: 'Bad Request: Missing restaurant ID' });
    }

    const restaurant = restaurantService.getRestaurantById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not own this restaurant' });
    }

    next();
};

// Export middlewares as an object
module.exports = {
    requireAuth,
    optionalAuth,
    requireRestaurantOwner,
    requireRestaurantOwnership
};