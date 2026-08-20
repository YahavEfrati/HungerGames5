import { API_URL } from './userService';
import { getAuthHeaders } from './authService';

const ORDERS_URL = `${API_URL}/orders`;

/**
 * Creates/places a new order.
 * POST /api/orders
 * 
 * @param {Object} orderData - The order payload: { restaurantId, addressX, addressY, tip, items }
 * @returns {Promise<Object>} The server response or success metadata.
 */
export const createOrder = async (orderData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(ORDERS_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to place order');
    }

    if (response.status === 201) {
        const location = response.headers.get('Location');
        return { success: true, location };
    }

    return await response.json().catch(() => ({ success: true }));
};

/**
 * Fetches all orders for the authenticated user.
 * GET /api/orders
 * 
 * @param {string} [userId] - Optional user ID for filtering.
 * @returns {Promise<Array>} List of user orders.
 */
export const getOrders = async (userId) => {
    const headers = await getAuthHeaders();
    const url = userId ? `${ORDERS_URL}?userId=${userId}` : ORDERS_URL;
    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch orders');
    }

    return await response.json();
};

/**
 * Fetches a single order by ID.
 * GET /api/orders/{orderId}
 * 
 * @param {string} orderId - ID of the order.
 * @returns {Promise<Object>} Order details.
 */
export const getOrderById = async (orderId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_URL}/${orderId}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch order');
    }

    return await response.json();
};

/**
 * Updates an order in PENDING state.
 * PATCH /api/orders/{orderId}
 * 
 * @param {string} orderId - The ID of the order to update.
 * @param {Object} updateData - Updated fields (tip, addressX, addressY, items).
 * @returns {Promise<Object|null>} Updated order or null on 204.
 */
export const updateOrder = async (orderId, updateData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_URL}/${orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update order');
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

/**
 * Cancels/deletes an order.
 * DELETE /api/orders/{orderId}
 * 
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<boolean>} True if cancelled successfully.
 */
export const cancelOrder = async (orderId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${ORDERS_URL}/${orderId}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to cancel order');
    }

    return true;
};
