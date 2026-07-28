class OrderModel {
    constructor() {
        /**
         * Internal Map to store all orders.
         * Key: Order ID (UUID)
         * Value: Order Object
         */
        this.orders = new Map();
    }

    /**
     * Saves a new order to the internal Map.
     * @param {*} orderData - The verified data for the new order, including generated UUID.
     */
    saveOrder(orderData) {
        this.orders.set(orderData.id, orderData);
    }

    /**
     * Retrieves an order by its unique ID.
     * @param {*} id - The unique ID of the order to find.
     * @returns {Object} The order object if found, otherwise undefined.
     */
    findOrderById(id) {
        return this.orders.get(id);
    }

    /**
     * Retrieves all orders stored in the internal Map.
     * @returns {Array} An array of all order objects.
     */
    findAllOrders() {
        return Array.from(this.orders.values());
    }

    /**
     * Deletes an order by its unique ID.
     * @param {*} id - The unique ID of the order to delete.
     */
    deleteOrder(id) {
        this.orders.delete(id);
    }
    
}

module.exports = new OrderModel()