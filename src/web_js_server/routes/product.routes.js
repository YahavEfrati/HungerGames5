const express = require('express');

const router = express.Router({ mergeParams: true });
const productController = require('../controllers/product.controller');
const { requireAuth, optionalAuth, requireRestaurantOwner, requireRestaurantOwnership }  = require('../middlewares/auth.middleware');

/**
 * Product Routes.
 * Base path: /api/restaurants/:id/products
 */

router.route('/')
    .get(productController.getProductsByRestaurant.bind(productController)) // everyone can view products of a restaurant
    .post(requireAuth, requireRestaurantOwner, requireRestaurantOwnership, productController.createProduct.bind(productController)); // only the specific restaurant owner can add products

router.route('/:pId')
    .get(optionalAuth, productController.getProductById.bind(productController))  // everyone can view a product, but if they are authenticated we will send them a notification in the background about the product they viewed
    .patch(requireAuth, requireRestaurantOwner, requireRestaurantOwnership, productController.updateProduct.bind(productController)) // only the specific restaurant owner can update products
    .delete(requireAuth, requireRestaurantOwner, requireRestaurantOwnership, productController.deleteProduct.bind(productController)); // only the specific restaurant owner can delete products

module.exports = router;