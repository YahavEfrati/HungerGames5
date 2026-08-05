const restaurantModel = require('../models/restaurant.model');

/**
 * Product Service.
 * Handles the business logic for product operations.
 */
class ProductService {
    
    _validateProductData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['name', 'price'];
        const optionalFields = ['description', 'image'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            for (const field of requiredFields) {
                if (data[field] === undefined || data[field] === null) {
                    return false;
                }
                if (field === 'name') {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') return false;
                } else if (field === 'price') {
                    const price = Number(data[field]);
                    if (isNaN(price) || price < 0) return false;
                }
            }
        } else {
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) continue;
                if (data[field] === null) return false;

                if (field === 'name') {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') return false;
                } else if (field === 'price') {
                    const price = Number(data[field]);
                    if (isNaN(price) || price < 0) return false;
                } else if (field === 'description') {
                    if (typeof data[field] !== 'string') return false;
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
        // Validate product data before creation
        if (!this._validateProductData(productData, false)) {
            throw new Error('Invalid product data: name and price are required');
        }

        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Push the new product to the Mongoose Document Array
        restaurant.products.push(productData);
        await restaurant.save();

        // Return the newly created product (the last one in the array)
        return restaurant.products[restaurant.products.length - 1];
    }

    // GET (all products)
    async getProductsByRestaurant(restaurantId) {
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant || !restaurant.products) return null;
        
        return restaurant.products;
    }

    // GET (specific product)
    async getProductById(restaurantId, productId) {
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant || !restaurant.products) return null;
        
        // Use Mongoose's built-in .id() method to find a subdocument
        return restaurant.products.id(productId);
    }

    // PATCH
    /**
     * Updates a product in a restaurant.
     * @param {string} restaurantId - The ID of the restaurant.
     * @param {string} productId - The ID of the product to update.
     * @param {Object} updateData - The data to update (name, price, description).
     * @returns {Object|null} Updated product or null if not found.
     */
    async updateProduct(restaurantId, productId, updateData) {
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant || !restaurant.products) return null;

        const product = restaurant.products.id(productId);
        if (!product) return null;

        if (updateData.name !== undefined) {
            if (typeof updateData.name !== 'string' || updateData.name.trim() === '') throw new Error('Product name must be a non-empty string');
            product.name = updateData.name.trim();
        }

        if (updateData.price !== undefined) {
            const price = Number(updateData.price);
            if (isNaN(price) || price < 0) throw new Error('Product price must be a non-negative number');
            product.price = price;
        }

        if (updateData.description !== undefined) {
            if (typeof updateData.description !== 'string') throw new Error('Product description must be a string');
            product.description = updateData.description.trim();
        }

        if (updateData.image !== undefined) {
            product.image = updateData.image;
        }

        await restaurant.save();
        return product;
    }

    // DELETE
    async deleteProduct(restaurantId, productId) {
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant || !restaurant.products) return false;

        const product = restaurant.products.id(productId);
        if (!product) return false;

        // Use Mongoose's pull/deleteOne method to remove the subdocument
        product.deleteOne();
        await restaurant.save();
        return true;
    }

}

module.exports = new ProductService();
