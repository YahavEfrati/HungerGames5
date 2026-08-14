const mongoose = require('mongoose');
const restaurantModel = require('../models/restaurant.model');
const { POPULAR_CATEGORIES } = require('../models/category.model');

const validCategoryNames = POPULAR_CATEGORIES.map(c => c.name);

/**
 * Restaurant Service.
 * Handles the business logic and ID generation for restaurant operations.
 */
class RestaurantService {
    
    /**
     * Validates restaurant data for creation or update operations.
     * @param {Object} data - The restaurant data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateRestaurantData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') return false;

        const requiredFields = ['name', 'addressX', 'addressY', 'phone', 'kosher', 'working_hours', 'image', 'ownerId'];
        
        if (!isUpdate) {
            const hasAllFields = requiredFields.every(field => data[field] !== undefined && data[field] !== null);
            if (!hasAllFields) return false;
        }

        const stringFields = ['name', 'phone', 'image'];
        for (const field of stringFields) {
            if (data[field] !== undefined && (typeof data[field] !== 'string' || data[field].trim() === '')) {
                return false;
            }
        }

        if (data.addressX !== undefined) {
            const numX = typeof data.addressX === 'number' ? data.addressX : parseFloat(data.addressX);
            if (isNaN(numX)) return false;
            data.addressX = numX;
        }

        if (data.addressY !== undefined) {
            const numY = typeof data.addressY === 'number' ? data.addressY : parseFloat(data.addressY);
            if (isNaN(numY)) return false;
            data.addressY = numY;
        }

        if (data.categories !== undefined) {
            if (!Array.isArray(data.categories)) return false;
            const isValid = data.categories.every(cat => 
                (typeof cat === 'string' || typeof cat === 'object') && 
                (validCategoryNames.includes(cat) || (cat && (mongoose.Types.ObjectId.isValid(cat) || mongoose.Types.ObjectId.isValid(cat._id))))
            );
            if (!isValid) return false;
        }

        return true;
    }
    
    /**
     * Creates a new restaurant with validation.
     * @param {Object} restaurantData - The restaurant data to create.
     * @returns {Object} The newly created restaurant.
     * @throws Error if validation fails.
     */
    async createRestaurant(restaurantData) {
        // Validate restaurant data before creation
        if (!this._validateRestaurantData(restaurantData, false)) {
            throw new Error('Invalid restaurant data: name, addressX, addressY, phone, kosher, working_hours, image, and ownerId are required and must be valid.');
        }

        const newRes = await restaurantModel.create(restaurantData);
        return newRes;
    }
        
    async getAllRestaurants() {
        return await restaurantModel.find({}).populate('categories');
    }

    async getRestaurantById(id) {
		return await restaurantModel.findById(id).populate('categories');
	}

    /**
     * Retrieves restaurants filtered by category.
     */
    async getRestaurantsByCategory(category) {
        // Find the category by name to get its ObjectId
        const { Category } = require('../models/category.model');
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) return [];
        
        return await restaurantModel.find({ categories: categoryDoc._id }).populate('categories');
    }

    /**
     * Updates an existing restaurant with validation.
     * @param {string} id - The restaurant ID to update.
     * @param {Object} updateData - The data to update (partial update).
     * @returns {boolean} True if successful, false if restaurant not found.
     * @throws Error if validation fails.
     */
    async updateRestaurant(id, updateData) {
        // Validate update data before applying changes
        if (!this._validateRestaurantData(updateData, true)) {
            throw new Error('Invalid restaurant data provided for update');
        }

        // Define a strict whitelist of fields the user is allowed to modify
        const allowedUpdates = ['name', 'description', 'addressX', 'addressY', 'phone', 'kosher', 'working_hours', 'image', 'categories'];
        const filteredUpdateData = {};

        // Iterate and apply only the permitted and provided fields
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                filteredUpdateData[field] = updateData[field];
            }
        });

        const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
            id,
            filteredUpdateData,
            { new: true, runValidators: true }
        ).populate('categories');

        return updatedRestaurant || false;
    }
	
	
    async deleteRestaurant(id) {
        const deletedRes = await restaurantModel.findByIdAndDelete(id);
        return !!deletedRes;
	}
}

module.exports = new RestaurantService();
