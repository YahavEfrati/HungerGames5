const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/restaurants` : `http://localhost:${process.env.REACT_APP_API_PORT || 3000}/api/restaurants`;

export const getRestaurantById = async (id) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
    }

    return response.json();
};

export const getRestaurantProducts = async (id) => {
    const response = await fetch(`${API_URL}/${id}/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant products');
    }

    return response.json();
};

export const updateRestaurantProduct = async (restaurantId, productId, updateData) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${restaurantId}/products/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update restaurant product');
    }

    if (response.status === 204) return null;
    return response.json();
};

export const addRestaurantProduct = async (restaurantId, productData) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}/${restaurantId}/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to add restaurant product');
        }

        return await response.json();
    } catch (error) {
        console.error("API fetch failed in addRestaurantProduct.", error);
        throw error;
    }
};

export const deleteRestaurantProduct = async (restaurantId, productId) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}/${restaurantId}/products/${productId}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to delete restaurant product');
        }

        return true;
    } catch (error) {
        console.error("API fetch failed in deleteRestaurantProduct.", error);
        throw error;
    }
};

export const addRestaurant = async (restaurantData) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(restaurantData)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add restaurant');
    }

    return response.json();
};

export const updateRestaurant = async (restaurantId, updateData) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${restaurantId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update restaurant');
    }

    if (response.status === 204) return null;
    return response.json();
};

export const deleteRestaurant = async (restaurantId) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${restaurantId}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete restaurant');
    }

    return true;
};

