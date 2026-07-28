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
    searchGlobal(query) {
        const lowerCaseQuery = query.toLowerCase()
        // Retrieve all restaurants as a Map from the Restaurant Model and convert it to an array for easier processing
        const allRestaurants = Array.from(restaurantModel.getAllRestaurants()?.values() || [])
        const allProducts = []

        allRestaurants.forEach(restaurant => {
            // if products exist and are stored as a Map, we convert them to an array and add to the global products list
            if (restaurant.products && typeof restaurant.products.values === 'function') {
                const productsWithInfo = Array.from(restaurant.products.values()).map(product => ({
                    ...product,
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name
                }));
                allProducts.push(...productsWithInfo);
            }
        })
        
        // Filter restaurants that match the query in their name or description
        const matchingRestaurants = allRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
            restaurant.description?.toLowerCase().includes(lowerCaseQuery)
        );

        // Sort restaurants: exact match first, then starts with, then includes in name, then description
        matchingRestaurants.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            
            if (aName === lowerCaseQuery && bName !== lowerCaseQuery) return -1;
            if (bName === lowerCaseQuery && aName !== lowerCaseQuery) return 1;
            
            if (aName.startsWith(lowerCaseQuery) && !bName.startsWith(lowerCaseQuery)) return -1;
            if (bName.startsWith(lowerCaseQuery) && !aName.startsWith(lowerCaseQuery)) return 1;
            
            if (aName.includes(lowerCaseQuery) && !bName.includes(lowerCaseQuery)) return -1;
            if (bName.includes(lowerCaseQuery) && !aName.includes(lowerCaseQuery)) return 1;
            
            return 0;
        });

        // Filter products that match the query in their name or description
        const matchingProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description?.toLowerCase().includes(lowerCaseQuery)
        );

        // Sort products similarly
        matchingProducts.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            
            if (aName === lowerCaseQuery && bName !== lowerCaseQuery) return -1;
            if (bName === lowerCaseQuery && aName !== lowerCaseQuery) return 1;
            
            if (aName.startsWith(lowerCaseQuery) && !bName.startsWith(lowerCaseQuery)) return -1;
            if (bName.startsWith(lowerCaseQuery) && !aName.startsWith(lowerCaseQuery)) return 1;
            
            if (aName.includes(lowerCaseQuery) && !bName.includes(lowerCaseQuery)) return -1;
            if (bName.includes(lowerCaseQuery) && !aName.includes(lowerCaseQuery)) return 1;
            
            return 0;
        });

        return {
            restaurants: matchingRestaurants,
            products: matchingProducts
        };
    }

    
}

module.exports = new SearchService();