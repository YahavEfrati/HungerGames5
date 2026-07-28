const orderService = require('../services/order.service')

class OrderController {
    
    /**
     * Handles the creation of a new order.
     * @param {*} req - Express request object.
     * @param {*} res - Express response object.
     */
    createOrder(req, res) {
        const userId = req.user.id; // Extract user ID from the authenticated request

        // Validate the request body to ensure it contains the necessary order data
        if (!req.body || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: "Order must contain at least one item" })
        }

        // Validate that restaurantId and coordinates are present in the request body
        if (!req.body.restaurantId || req.body.addressX === undefined || req.body.addressY === undefined) {
            return res.status(400).json({ error: "Missing restaurantId, addressX, or addressY" })
        }

        try {
            const newOrder = orderService.createOrder(userId, req.body)
            res.location(`/api/orders/${newOrder.id}`)
            return res.status(201).send()

        } catch (error) {
            // If the error thrown by the service has a statusCode property, use it; otherwise, default to 400 Bad Request for validation errors
            const statusCode = error.statusCode || 400
            return res.status(statusCode).json({ error: error.message })
        }
    }

    /**
     * Handles the retrieval of all orders.
     * @param {*} req - Express request object.
     * @param {*} res - Express response object.
     */
    getOrders(req, res) {
        const userId = req.user.id; // Extract user ID from the authenticated request
        
        try {
            const orders = orderService.getOrdersByUserId(userId)
            return res.status(200).json(orders)
        }
        catch (error) {
            const statusCode = error.statusCode || 400
            return res.status(statusCode).json({ error: error.message })
        }
    }

    /**
     * Handles the retrieval of an order by its ID.
     * @param {*} req - Express request object.
     * @param {*} res - Express response object.
     */
   getOrderById(req, res) {
        const userId = req.user.id; // Extract user ID from the authenticated request

        if (!userId) {
            return res.status(400).json({ error: "Missing user ID in headers" });
        }

        try {
            const orderId = req.params.id;
            
            const order = orderService.getOrderById(orderId, userId);
            
            return res.status(200).json(order);

        } catch (error) {
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({ error: error.message });
        }
    }

    /**
     * Handles the update of an existing order.
     * @param {*} req - Express request object.
     * @param {*} res - Express response object.
     */
    updateOrder(req, res) {
        const userId = req.user.id; // Extract user ID from the authenticated request

        if (!userId) {
            return res.status(400).json({ error: "Missing user ID in headers" });
        }

        try {
            const orderId = req.params.id;
            const updateData = req.body; 

            orderService.updateOrder(orderId, userId, updateData);

            return res.status(204).end();

        } catch (error) {
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({ error: error.message });
        }
    }

    /**
     * Handles the deletion of an order.
     * @param {*} req - Express request object.
     * @param {*} res - Express response object.
     */
    deleteOrder(req, res) {
        const userId = req.user.id; // Extract user ID from the authenticated request
        
        if (!userId) {
            return res.status(400).json({ error: "Missing user ID in headers" });
        }

        try {
            const orderId = req.params.id;

            orderService.deleteOrder(orderId, userId);

            return res.status(204).end();

        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ error: error.message });
        }
    }
}

module.exports = new OrderController()