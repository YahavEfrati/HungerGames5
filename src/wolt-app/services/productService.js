import { API_URL } from './userService';
import { getToken } from './authService';

/**
 * Returns authorization headers with JWT token if available.
 * @returns {Promise<Object>} Headers object with Authorization and Content-Type.
 */
export const getAuthHeaders = async () => {
    const token = await getToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Creates a new product for a restaurant.
 * Supports both createProduct(productData) where productData contains restaurantId,
 * or createProduct(restaurantId, productData).
 * 
 * @param {string|Object} arg1 - Restaurant ID or productData object.
 * @param {Object} [arg2] - Product data if restaurantId is arg1.
 * @returns {Promise<Object>} Created product object.
 */
export const createProduct = async (arg1, arg2) => {
    let restaurantId;
    let productData;

    if (arg2 !== undefined) {
        restaurantId = arg1;
        productData = arg2;
    } else if (typeof arg1 === 'object' && arg1 !== null) {
        productData = arg1;
        restaurantId = productData.restaurantId || productData.restaurant_id;
    } else {
        throw new Error('Invalid arguments provided to createProduct');
    }

    if (!restaurantId) {
        throw new Error('Restaurant ID is required to create a product');
    }

    const headers = await getAuthHeaders();
    const url = `${API_URL}/restaurants/${restaurantId}/products`;

    const payload = {
        name: productData.name ? productData.name.trim() : '',
        price: Number(productData.price),
        description: productData.description ? productData.description.trim() : '',
        image: productData.image ? productData.image.trim() : '',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to create product');
    }

    return responseData;
};

/**
 * Updates an existing product.
 * Supports updateProduct(productId, updateData) and updateProduct(restaurantId, productId, updateData).
 * 
 * @param {string} arg1 - Restaurant ID or Product ID.
 * @param {string|Object} arg2 - Product ID or updateData object.
 * @param {Object} [arg3] - updateData object if restaurantId and productId are arg1 and arg2.
 * @returns {Promise<Object|null>} Updated product object or null if 204 No Content.
 */
export const updateProduct = async (arg1, arg2, arg3) => {
    let restaurantId;
    let productId;
    let updateData;

    if (arg3 !== undefined) {
        restaurantId = arg1;
        productId = arg2;
        updateData = arg3;
    } else {
        productId = arg1;
        updateData = arg2 || {};
        restaurantId = updateData.restaurantId || updateData.restaurant_id;
    }

    const headers = await getAuthHeaders();
    const url = restaurantId
        ? `${API_URL}/restaurants/${restaurantId}/products/${productId}`
        : `${API_URL}/products/${productId}`;

    const payload = {};
    if (updateData.name !== undefined) payload.name = updateData.name.trim();
    if (updateData.price !== undefined) payload.price = Number(updateData.price);
    if (updateData.description !== undefined) payload.description = updateData.description.trim();
    if (updateData.image !== undefined) payload.image = updateData.image.trim();

    const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || responseData.message || 'Failed to update product');
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json().catch(() => null);
};

/**
 * Deletes an existing product.
 * Supports deleteProduct(productId) and deleteProduct(restaurantId, productId).
 * 
 * @param {string} arg1 - Restaurant ID or Product ID.
 * @param {string} [arg2] - Product ID if restaurantId was arg1.
 * @returns {Promise<boolean>} True if successfully deleted.
 */
export const deleteProduct = async (arg1, arg2) => {
    let restaurantId;
    let productId;

    if (arg2 !== undefined) {
        restaurantId = arg1;
        productId = arg2;
    } else {
        productId = arg1;
    }

    const headers = await getAuthHeaders();
    const url = restaurantId
        ? `${API_URL}/restaurants/${restaurantId}/products/${productId}`
        : `${API_URL}/products/${productId}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || responseData.message || 'Failed to delete product');
    }

    return true;
};

/**
 * Fetches all products for a restaurant.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Array>} List of products.
 */
export const getProductsByRestaurant = async (restaurantId) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products for restaurant:', error);
        return [];
    }
};

/**
 * Fetches a single product by ID for a restaurant.
 * Sends JWT authorization token if available for background analytics tracking.
 * @param {string} restaurantId - Restaurant ID.
 * @param {string} productId - Product ID.
 * @returns {Promise<Object>} Product object.
 */
export const getProductById = async (restaurantId, productId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/products/${productId}`, {
        method: 'GET',
        headers,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to fetch product');
    }

    return responseData;
};
