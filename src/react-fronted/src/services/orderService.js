/**
 * Order Service.
 * Handles all HTTP requests related to orders against the Node.js server.
 */

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/orders` : `http://localhost:${process.env.REACT_APP_API_PORT || 3000}/api/orders`;

/**
 * Helper function to generate authorization headers
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Fetches all previous orders for the logged-in user.
 * GET /api/orders
 * (or optionally filters by userId query parameter if needed, but backend resolves req.user.id)
 * 
 * @param {string} [userId] - Optional user ID for matching queries
 * @returns {Promise<Array>} List of user orders.
 */
export const getOrders = async (userId) => {
    const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch orders');
    }

    return response.json();
};

/**
 * Handles updating/editing an order when it is still in the PENDING state.
 * PATCH /api/orders/{orderId}
 * 
 * @param {string} orderId - The ID of the order to update.
 * @param {Object} updateData - The update fields (e.g., items, tip, address).
 * @returns {Promise<Object|null>} The updated order or null if 204.
 */
export const updateOrder = async (orderId, updateData) => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update order');
    }

    if (response.status === 204) {
        window.dispatchEvent(new Event('orderChanged'));
        return null;
    }
    window.dispatchEvent(new Event('orderChanged'));
    return response.json();
};

/**
 * Cancels/deletes an order.
 * DELETE /api/orders/{orderId}
 * 
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {Promise<boolean>} True if cancellation was successful.
 */
export const cancelOrder = async (orderId) => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to cancel order');
    }

    window.dispatchEvent(new Event('orderChanged'));
    return true;
};

/**
 * Creates/places a new order (useful for Reorder).
 * POST /api/orders
 * 
 * @param {Object} orderData - The order data including restaurantId, items array, and address (tip optional).
 * @returns {Promise<Object>} The server response or true.
 */
export const createOrder = async (orderData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to place order');
    }

    // Backend responds with 201 and Location header, returns empty body
    if (response.status === 201) {
        const location = response.headers.get('Location');
        window.dispatchEvent(new Event('orderChanged'));
        window.dispatchEvent(new Event('orderPlaced'));
        return { success: true, location };
    }

    window.dispatchEvent(new Event('orderChanged'));
    window.dispatchEvent(new Event('orderPlaced'));
    return response.json();
};
