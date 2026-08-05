const restaurantModel = require('../models/restaurant.model');

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

        const isMatch = item => 
            item?.name?.toLowerCase().includes(lowerCaseQuery) || 
            item?.description?.toLowerCase().includes(lowerCaseQuery);

        const docs = await restaurantModel.find({
            $or: [
                { name: regex }, 
                { description: regex }, 
                { 'products.name': regex }, 
                { 'products.description': regex }
            ]
        });

        const matchingRestaurants = [];
        const matchingProducts = [];

        for (const doc of docs) {
            const rest = doc.toObject ? doc.toObject() : { ...doc };
            
            if (isMatch(rest)) {
                const { products, ...cleanRest } = rest;
                matchingRestaurants.push(cleanRest);
            }
            
            if (rest.products && Array.isArray(rest.products)) {
                for (const product of rest.products) {
                    if (isMatch(product)) {
                        matchingProducts.push({
                            ...product,
                            restaurantId: rest._id || rest.id,
                            restaurantName: rest.name
                        });
                    }
                }
            }
        }
        
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

        matchingRestaurants.sort(sortItems);
        matchingProducts.sort(sortItems);

        return {
            restaurants: matchingRestaurants,
            products: matchingProducts
        };
            }
}

module.exports = new SearchService();