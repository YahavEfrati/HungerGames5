const restaurantModel = require('../models/restaurant.model');
const productModel = require('../models/product.model');
const { v4: uuidv4 } = require('uuid');
const POPULAR_CATEGORIES = require('../models/category.model');

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
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['name', 'addressX', 'addressY', 'phone', 'kosher', 'working_hours', 'image', 'ownerId'];
        const optionalFields = ['description', 'categories'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            for (const field of requiredFields) {
                if (data[field] === undefined || data[field] === null) {
                    return false;
                }
            }
        } else {
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    return false;
                }
                if (data[field] === null) {
                    return false;
                }
            }
        }

        for (const field of Object.keys(data)) {
            if (data[field] === undefined) continue;
            if (field === 'kosher') {
                if (typeof data[field] !== 'boolean') return false;
            } 
            else if (field === 'working_hours') {
                if (typeof data[field] !== 'string' && typeof data[field] !== 'object') return false;
            } 
            else if (['addressX', 'addressY'].includes(field)) {
                if (typeof data[field] !== 'number') return false;
            } 
            else if (['name', 'phone'].includes(field)) {
                if (typeof data[field] !== 'string' || data[field].trim() === '') return false;
            } 
            else if (field === 'description') {
                if (typeof data[field] !== 'string') return false;
            }
            else if (field === 'ownerId') {
                if (typeof data[field] !== 'string' && typeof data[field] !== 'number') return false;
                if (typeof data[field] === 'string' && data[field].trim() === '') return false;
            }

            else if (field === 'categories') {
                if (!Array.isArray(data[field])) return false;
                const hasInvalidCategory = data[field].some(cat => typeof cat !== 'string' || !validCategoryNames.includes(cat));
                if (hasInvalidCategory) return false;
            }
            else if (field === 'image') {
                if (typeof data[field] !== 'string' || data[field].trim() === '') return false;
            }
        }

        return true;
    }
    
    /**
     * Creates a new restaurant with validation.
     * @param {Object} restaurantData - The restaurant data to create.
     * @returns {Object} The newly created restaurant.
     * @throws Error if validation fails.
     */
    createRestaurant(restaurantData) {
        // Validate restaurant data before creation
        if (!this._validateRestaurantData(restaurantData, false)) {
            throw new Error('Invalid restaurant data: name, addressX, addressY, phone, kosher, working_hours, image, and ownerId are required and must be valid.');
        }

        // Generate a unique UUID for the new restaurant
        const id = uuidv4();
        // Create the new Restaurant object and store it using the Model
        const newRes = restaurantModel.createRestaurant({id , ...restaurantData});
        return newRes;
    }
        
    getAllRestaurants() {
        const restaurantsMap = restaurantModel.getAllRestaurants();
        // Convert the Map to Array and return it.
        return Array.from(restaurantsMap.values());
    }
    
    getRestaurantById(id) {
		return restaurantModel.getRestaurantById(id);
	}
    
    /**
     * Updates an existing restaurant with validation.
     * @param {string} id - The restaurant ID to update.
     * @param {Object} updateData - The data to update (partial update).
     * @returns {boolean} True if successful, false if restaurant not found.
     * @throws Error if validation fails.
     */
    updateRestaurant(id, updateData) {
        const resForUpdate = this.getRestaurantById(id);
        if (!resForUpdate) {
            return false;
        }

        // Validate update data before applying changes
        if (!this._validateRestaurantData(updateData, true)) {
            throw new Error('Invalid restaurant data provided for update');
        }

        // Create a copy of the original restaurant
        const mergedRestaurant = { ...resForUpdate };

        // Define a strict whitelist of fields the user is allowed to modify
        const allowedUpdates = ['name', 'description', 'addressX', 'addressY', 'phone', 'kosher', 'working_hours', 'image', 'categories'];

        // Iterate and apply only the permitted and provided fields
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                mergedRestaurant[field] = updateData[field];
            }
        });

        // Update using Model
        restaurantModel.updateRestaurant(id, mergedRestaurant);
        return mergedRestaurant;
    }
	
	
    deleteRestaurant(id) {
		if (!this.getRestaurantById(id)) {
			return false
		}
		restaurantModel.deleteRestaurant(id);
		return true
	}
}

module.exports = new RestaurantService();
