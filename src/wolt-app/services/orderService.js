import { API_URL } from './userService';
import { getToken } from './authService';

/**
 * Helper to construct the Authorization header with the JWT token.
 * @returns {Promise<Object>} The headers object.
 */
const getAuthHeaders = async () => {
    const token = await getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Fetches all orders for the currently authenticated user.
 * GET /api/orders
 * @returns {Promise<Array>} A promise resolving to an array of orders.
 */
export const getOrders = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch orders');
    }

    return response.json();
};

/**
 * Updates/Edits a specific pending order.
 * PATCH /api/orders/{orderId}
 * @param {string} orderId - The unique identifier of the order.
 * @param {Object} updateData - The update fields (e.g., items, tip, addressX, addressY).
 * @returns {Promise<Object>} A promise resolving to the updated order.
 */
export const updateOrder = async (orderId, updateData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update order');
    }

    if (response.status === 204) return null;
    return response.json();
};

/**
 * Cancels/Deletes a specific order.
 * DELETE /api/orders/{orderId}
 * @param {string} orderId - The unique identifier of the order.
 * @returns {Promise<boolean>} A promise resolving to true on success.
 */
export const cancelOrder = async (orderId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to cancel order');
    }

    return true;
};
