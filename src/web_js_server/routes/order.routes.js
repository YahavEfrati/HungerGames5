const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller');
const { requireAuth, requireAdmin} = require('../middlewares/auth.middleware');


/**
 * Order Routes.
 * Base path: /api/orders
 */

// Only authenticated users can create, view, update, or delete their orders.
router.route('/')
    .post(requireAuth, orderController.createOrder.bind(orderController))
    .get(requireAuth, orderController.getOrders.bind(orderController));

router.route('/:id')
    .get(requireAuth, orderController.getOrderById.bind(orderController))
    .patch(requireAuth, orderController.updateOrder.bind(orderController))
    .delete(requireAuth, orderController.deleteOrder.bind(orderController));

module.exports = router;