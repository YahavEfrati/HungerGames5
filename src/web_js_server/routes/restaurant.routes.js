const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const productRoutes = require('./product.routes');
const { requireAuth, optionalAuth, requireRestaurantOwner, requireRestaurantOwnership } = require('../middlewares/auth.middleware');

router.use('/:id/products', productRoutes);
/**
 * Restaurant Routes.
 * Base path: /api/restaurants
 */

router.route('/')
    .get(restaurantController.getRestaurantsList.bind(restaurantController))
    .post(requireAuth, requireRestaurantOwner, restaurantController.createRestaurant.bind(restaurantController));
router.route('/:id')
    .get(optionalAuth, restaurantController.getRestaurantById.bind(restaurantController))
    .patch(requireAuth, requireRestaurantOwner, requireRestaurantOwnership, restaurantController.updateRestaurant.bind(restaurantController))
    .delete(requireAuth, requireRestaurantOwner, requireRestaurantOwnership, restaurantController.deleteRestaurant.bind(restaurantController));
router.route('/category/:category')
    .get(restaurantController.getRestaurantsByCategory.bind(restaurantController));

module.exports = router;
