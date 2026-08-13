import { API_URL } from './userService';

/**
 * Fetches the restaurant details by its ID.
 * @param {string} id - The restaurant ID.
 * @returns {Promise<Object>} The restaurant object.
 */
export const getRestaurantById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch restaurant');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        throw error;
    }
};

/**
 * Fetches the products (menu) of a specific restaurant.
 * @param {string} id - The restaurant ID.
 * @returns {Promise<Array>} The list of products.
 */
export const getRestaurantProducts = async (id) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${id}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            return []; // Fallback to empty array if no products or error
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching restaurant products:', error);
        return [];
    }
};
