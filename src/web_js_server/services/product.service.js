const restaurantModel = require('../models/restaurant.model');
const productModel = require('../models/product.model');
const { v4: uuidv4 } = require('uuid');

/**
 * Product Service.
 * Handles the business logic for product operations.
 */
class ProductService {
    
    /**
     * Validates product data for creation or update operations.
     * @param {Object} data - The product data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateProductData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['name', 'price'];
        const optionalFields = ['description', 'image'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            // For creation: validate all required fields are present and properly typed
            for (const field of requiredFields) {
                if (data[field] === undefined || data[field] === null) {
                    return false;
                }

                if (field === 'name') {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') {
                        return false;
                    }
                } else if (field === 'price') {
                    const price = Number(data[field]);
                    if (isNaN(price) || price < 0) {
                        return false;
                    }
                }
            }
        } else {
            // For update: only validate fields that are provided and are in the allowed list
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }

                if (data[field] === null) {
                    return false;
                }

                // Type-specific validation for provided fields
                if (field === 'name') {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') {
                        return false;
                    }
                } else if (field === 'price') {
                    const price = Number(data[field]);
                    if (isNaN(price) || price < 0) {
                        return false;
                    }
                } else if (field === 'description') {
                    if (typeof data[field] !== 'string') {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Creates a new product for a restaurant with validation.
     * @param {string} restaurantId - The ID of the restaurant.
     * @param {Object} productData - The product data (name, price, description).
     * @returns {Object} The newly created product.
     * @throws Error if validation fails or restaurant not found.
     */
    createProductForRestaurant(restaurantId, productData){
        // Check if restaurant exists
        const restaurant = restaurantModel.getRestaurantById(restaurantId);
        if(!restaurant){
            throw new Error('Restaurant not found');
        }

        // Validate product data before creation
        if (!this._validateProductData(productData, false)) {
            throw new Error('Invalid product data: name and price are required');
        }

        const newProductId = uuidv4();
        const newProduct = productModel.createProduct(productData, newProductId)
        restaurant.products.set(newProduct.id, newProduct);

        return newProduct;
    }

    // GET (all products)
    getProductsByRestaurant(restaurantId){
        const restaurant = restaurantModel.getRestaurantById(restaurantId);
        if (!restaurant || !restaurant.products) return null;
        
        return Array.from(restaurant.products.values());
    }

    // GET (specific product)
    getProductById(restaurantId, productId){
        const restaurant = restaurantModel.getRestaurantById(restaurantId);
        if(!restaurant || !restaurant.products) return null;
        
        return restaurant.products.get(productId);
    
    }

    // PATCH
    /**
     * Updates a product in a restaurant.
     * @param {string} restaurantId - The ID of the restaurant.
     * @param {string} productId - The ID of the product to update.
     * @param {Object} updateData - The data to update (name, price, description).
     * @returns {Object|null} Updated product or null if not found.
     */
    updateProduct(restaurantId, productId, updateData) {
        const restaurant = restaurantModel.getRestaurantById(restaurantId);
        
        if (!restaurant || !restaurant.products) {
            return null;
        }

        const product = restaurant.products.get(productId);
        
        if (!product) {
            return null;
        }

        // Update name with validation
        if (updateData.name !== undefined) {
            if (typeof updateData.name !== 'string' || updateData.name.trim() === '') {
                throw new Error('Product name must be a non-empty string');
            }
            product.name = updateData.name.trim();
        }

        // Update price with strict validation
        if (updateData.price !== undefined) {
            const price = Number(updateData.price);
            if (isNaN(price) || price < 0) {
                throw new Error('Product price must be a non-negative number');
            }
            product.price = price;
        }

        // Update description with validation
        if (updateData.description !== undefined) {
            if (typeof updateData.description !== 'string') {
                throw new Error('Product description must be a string');
            }
            product.description = updateData.description.trim();
        }

        // Update image
        if (updateData.image !== undefined) {
            product.image = updateData.image;
        }

        return product;
    }

    // DELETE
    deleteProduct(restaurantId, productId){
        const restaurant = restaurantModel.getRestaurantById(restaurantId);
        if (!restaurant || !restaurant.products.has(productId)) return false;

        restaurant.products.delete(productId);
        return true

    }

}

module.exports = new ProductService();
