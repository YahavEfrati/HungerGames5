const restaurantModel = require('../models/restaurant.model');
const productModel = require('../models/product.model');

/**
 * Search Service.
 * Handles the business logic for searching restaurants and products based on a query string.
 */
class SearchService {

    /**
     * Searches for restaurants and products matching the query.
     * @param {string} query - The search query string.
     * @returns {object} A structured response containing matching restaurants and products.
     */
    async searchGlobal(query) {
        if (!query) {
            return { restaurants: [], products: [] };
        }
        const lowerCaseQuery = query.toLowerCase()
        const regex = new RegExp(query, 'i');

        const sortItems = (a, b) => {
            const aName = (a.name || '').toLowerCase();
            const bName = (b.name || '').toLowerCase();
            
            if (aName === lowerCaseQuery && bName !== lowerCaseQuery) return -1;
            if (bName === lowerCaseQuery && aName !== lowerCaseQuery) return 1;
            
            if (aName.startsWith(lowerCaseQuery) && !bName.startsWith(lowerCaseQuery)) return -1;
            if (bName.startsWith(lowerCaseQuery) && !aName.startsWith(lowerCaseQuery)) return 1;
            
            if (aName.includes(lowerCaseQuery) && !bName.includes(lowerCaseQuery)) return -1;
            if (bName.includes(lowerCaseQuery) && !aName.includes(lowerCaseQuery)) return 1;
            
            return 0;
        };

        // 1. Search for matching restaurants
        const rawRestaurants = await restaurantModel.find({
            $or: [
                { name: regex }, 
                { description: regex }
            ]
        }).populate('categories', 'name').lean();

        // Map populated Category objects to just their string names
        const matchingRestaurants = rawRestaurants.map(rest => {
            return {
                ...rest,
                categories: rest.categories && Array.isArray(rest.categories) 
                    ? rest.categories.map(cat => (cat && cat.name) ? cat.name : cat)
                    : []
            };
        });

        // 2. Search for matching products in the distinct Product collection
        const rawProducts = await productModel.find({
            $or: [
                { name: regex }, 
                { description: regex }
            ]
        }).populate('restaurantId', 'name').lean();

        // 3. Format products to match the expected frontend structure
        const matchingProducts = rawProducts.map(product => {
            return {
                ...product,
                restaurantId: product.restaurantId ? product.restaurantId._id : null,
                restaurantName: product.restaurantId ? product.restaurantId.name : null
            };
        });

        matchingRestaurants.sort(sortItems);
        matchingProducts.sort(sortItems);

        return {
            restaurants: matchingRestaurants,
            products: matchingProducts
        };
    }
}

module.exports = new SearchService();