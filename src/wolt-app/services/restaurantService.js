import { API_URL } from './userService';
import { getToken } from './authService';

/**
 * Fetches all restaurants from backend.
 * @returns {Promise<Array>} List of restaurants.
 */
export const getRestaurants = async () => {
    const response = await fetch(`${API_URL}/restaurants`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch restaurants');
    }

    return data;
};

/**
 * Fetches restaurants owned by a specific owner user.
 * @param {string} ownerId - The ID of the owner user.
 * @returns {Promise<Array>} List of restaurants owned by user.
 */
export const getOwnerRestaurants = async (ownerId) => {
    const restaurants = await getRestaurants();
    if (!ownerId) return [];

    return restaurants.filter(r => {
        const rOwnerId = typeof r.ownerId === 'object' && r.ownerId !== null ? (r.ownerId._id || r.ownerId.id) : r.ownerId;
        return String(rOwnerId) === String(ownerId);
    });
};

/**
 * Fetches a single restaurant by ID.
 * @param {string} id - Restaurant ID.
 * @returns {Promise<Object>} Restaurant details.
 */
export const getRestaurantById = async (id) => {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch restaurant details');
    }

    return data;
};

/**
 * Fetches categories list.
 * @returns {Promise<Array>} List of categories.
 */
export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch categories');
    }

    // Return category objects array (with _id, name, etc.)
    if (Array.isArray(data)) {
        return data;
    } else if (data && Array.isArray(data.POPULAR_CATEGORIES)) {
        return data.POPULAR_CATEGORIES;
    }
    return [];
};

const cleanCategoryIds = (cats) => {
    if (!Array.isArray(cats)) return [];
    const flattened = cats.flat(Infinity);
    return flattened.map(c => {
        if (typeof c === 'object' && c !== null) {
            return String(c._id || c.id || c.name || '');
        }
        return String(c);
    }).filter(id => id && id.length > 0 && id !== '[object Object]' && id !== 'undefined');
};

/**
 * Creates a new restaurant (POST request).
 * Requires authorization token.
 * @param {Object} restaurantData - Restaurant metadata payload.
 * @returns {Promise<Object>} Created restaurant object.
 */
export const createRestaurant = async (restaurantData) => {
    const token = await getToken();
    if (!token) {
        throw new Error('Authentication token required to create a restaurant');
    }

    const payload = {
        name: restaurantData.name ? restaurantData.name.trim() : '',
        description: restaurantData.description ? restaurantData.description.trim() : '',
        phone: restaurantData.phone ? restaurantData.phone.trim() : '',
        addressX: Number(restaurantData.addressX),
        addressY: Number(restaurantData.addressY),
        kosher: Boolean(restaurantData.kosher),
        working_hours: restaurantData.working_hours ? restaurantData.working_hours.trim() : '',
        categories: cleanCategoryIds(restaurantData.categories),
        image: restaurantData.image ? restaurantData.image.trim() : '',
    };

    const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to create restaurant');
    }

    return responseData;
};

/**
 * Updates an existing restaurant (PATCH request).
 * Requires authorization token.
 * @param {string} id - Restaurant ID.
 * @param {Object} updateData - Updated restaurant fields payload.
 * @returns {Promise<Object>} Updated restaurant object.
 */
export const updateRestaurant = async (id, updateData) => {
    const token = await getToken();
    if (!token) {
        throw new Error('Authentication token required to update restaurant');
    }

    const payload = {};
    if (updateData.name !== undefined) payload.name = updateData.name.trim();
    if (updateData.description !== undefined) payload.description = updateData.description.trim();
    if (updateData.phone !== undefined) payload.phone = updateData.phone.trim();
    if (updateData.addressX !== undefined) payload.addressX = Number(updateData.addressX);
    if (updateData.addressY !== undefined) payload.addressY = Number(updateData.addressY);
    if (updateData.kosher !== undefined) payload.kosher = Boolean(updateData.kosher);
    if (updateData.working_hours !== undefined) payload.working_hours = updateData.working_hours.trim();
    if (updateData.categories !== undefined) {
        payload.categories = cleanCategoryIds(updateData.categories);
    }
    if (updateData.image !== undefined) payload.image = updateData.image.trim();

    const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to update restaurant');
    }

    return responseData;
};

/**
 * Deletes a restaurant (DELETE request).
 * Requires authorization token.
 * @param {string} id - Restaurant ID.
 * @returns {Promise<boolean>} True if successfully deleted.
 */
export const deleteRestaurant = async (id) => {
    const token = await getToken();
    if (!token) {
        throw new Error('Authentication token required to delete restaurant');
    }

    const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || responseData.message || 'Failed to delete restaurant');
    }

    return true;
};
