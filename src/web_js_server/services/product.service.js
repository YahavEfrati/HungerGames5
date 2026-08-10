const restaurantModel = require('../models/restaurant.model');
const productModel = require('../models/product.model');

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
    async createProductForRestaurant(restaurantId, productData){
        // Validate product data before creation
        if (!this._validateProductData(productData, false)) {
            throw new Error('Invalid product data: name and price are required');
        }

        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Create the product in the Product collection using productModel
        productData.restaurantId = restaurantId;
        const newProduct = await productModel.create(productData);
        return newProduct;
    }

    // GET (all products)
    async getProductsByRestaurant(restaurantId) {
        // Find all products that reference this restaurantId
        return await productModel.find({ restaurantId: restaurantId });
    }

    // GET (specific product)
    async getProductById(restaurantId, productId) {
        return await productModel.findOne({ _id: productId, restaurantId: restaurantId });
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
        const product = await productModel.findOne({ _id: productId, restaurantId: restaurantId });
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

        await product.save();
        return product;
    }

    // DELETE
    async deleteProduct(restaurantId, productId) {
        const result = await productModel.deleteOne({ _id: productId, restaurantId: restaurantId });
        return result.deletedCount > 0;
    }

}

module.exports = new ProductService();
