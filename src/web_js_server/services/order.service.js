const orderModel = require('../models/order.model');
const restaurantModel = require('../models/restaurant.model');
const productService = require('../services/product.service');
const userService = require('../services/user.service');

class OrderService {
    constructor() {
        this.activeTimers = new Map();
    }

    /**
     * Validates order data for creation or update operations.
     * @param {Object} data - The order data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateOrderData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['restaurantId', 'items', 'addressX', 'addressY'];
        const optionalFields = ['tip'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            if (typeof data.restaurantId !== 'string' || data.restaurantId.trim() === '') return false;
            
            if (!Array.isArray(data.items) || data.items.length === 0) return false;
            for (const item of data.items) {
                if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') return false;
                const quantity = Number(item.quantity) || 1;
                if (quantity <= 0 || !Number.isInteger(quantity)) return false;
            }

            if (typeof data.addressX !== 'number' || typeof data.addressY !== 'number') return false;

            if (data.tip !== undefined && data.tip !== null) {
                const tip = Number(data.tip);
                if (isNaN(tip) || tip < 0) return false;
            }
        } else {
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) continue;
                if (data[field] === null) return false;

                if (field === 'tip') {
                    const tip = Number(data[field]);
                    if (isNaN(tip) || tip < 0) return false;
                } else if (field === 'addressX' || field === 'addressY') {
                    if (typeof data[field] !== 'number') return false;
                } else if (field === 'items') {
                    if (!Array.isArray(data[field]) || data[field].length === 0) return false;
                    for (const item of data[field]) {
                        if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') return false;
                        const quantity = Number(item.quantity) || 1;
                        if (quantity <= 0 || !Number.isInteger(quantity)) return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Starts or resets the lifecycle timer for a pending order.
     * Transitions from pending -> active (20s) -> completed (10s).
     * @param {string} orderId - The ID of the order.
     * @private
     */
    _startLifecycleTimer(orderId) {
        const idStr = orderId.toString(); // Safety for MongoDB ObjectId as Map key

        if (this.activeTimers.has(idStr)) {
            clearTimeout(this.activeTimers.get(idStr));
            this.activeTimers.delete(idStr);
        }

        const pendingToActiveTimer = setTimeout(async () => {
            try {
                const order = await orderModel.findById(idStr);
                if (order && order.status === 'pending') {
                    order.status = 'active';
                    await order.save();

                    const activeToCompletedTimer = setTimeout(async () => {
                        try {
                            const activeOrder = await orderModel.findById(idStr);
                            if (activeOrder && activeOrder.status === 'active') {
                                activeOrder.status = 'completed';
                                await activeOrder.save();
                            }
                        } catch (err) {
                            console.error('Timer Error (Active to Completed):', err);
                        }
                        this.activeTimers.delete(idStr);
                    }, 10000); 

                    this.activeTimers.set(idStr, activeToCompletedTimer);
                } else {
                    this.activeTimers.delete(idStr);
                }
            } catch (err) {
                console.error('Timer Error (Pending to Active):', err);
                this.activeTimers.delete(idStr);
            }
        }, 20000); 

        this.activeTimers.set(idStr, pendingToActiveTimer);
    }

    /**
     * Creates a new order for a user with the provided order data.
     * @param {*} userId - the ID of the user placing the order
     * @param {*} orderData - the data for the order, must include restaurantId, items array, and addressX/addressY, tip is optional
     * @throws Error with appropriate status code in message if validation fails (e.g. missing fields, product not found, product not in restaurant)
     */
    async createOrder(userId, orderData) {
        if (!this._validateOrderData(orderData, false)) {
            throw new Error('Invalid order data: restaurantId, items array (with positive integer quantities), and numerical addressX/addressY coordinates are required');
        }

        const totalPrice = await this._validateAndCalculateOrder(orderData);
        
        const restaurant = await restaurantModel.findById(orderData.restaurantId);
        if (restaurant && totalPrice < restaurant.minimumOrder) {
            const error = new Error(`Order total is below the minimum order amount of ₪${restaurant.minimumOrder}`);
            error.statusCode = 400;
            throw error;
        }

        const newOrder = await orderModel.create({
            userId: userId,
            restaurantId: orderData.restaurantId,
            items: orderData.items,
            totalPrice: totalPrice,
            status: 'pending',
            tip: orderData.tip || 0,
            addressX: orderData.addressX,
            addressY: orderData.addressY
        });

        this._startLifecycleTimer(newOrder._id);

        return newOrder;
    }
        
    /**
     * validates the order data by checking if all products exist and belong to the specified restaurant, and calculates the total price of the order including the tip.
     * @param {*} orderData - data for the order, including restaurantId, items array, and optional tip
     * @returns totalPrice of the order
     * @throws Error if any product is not found or does not belong to the specified restaurant with appropriate status codes in the error message
     */
    async _validateAndCalculateOrder(orderData) {
        let totalPrice = 0;

        for (const item of orderData.items) {
            const realProduct = await productService.getProductById(orderData.restaurantId, item.productId);
            if (!realProduct) {
                const error = new Error('Products or Restaurant not found');
                error.statusCode = 404;
                throw error;
            }
            const price = Number(realProduct.price);
            totalPrice += (price * (Number(item.quantity) || 1));
        }

        totalPrice += Number(orderData.tip || 0);
        return totalPrice;
    }

    async getOrdersByUserId(userId) {
        return await orderModel.find({ userId: userId });
    }

   async getOrderById(orderId, userId) {
        const order = await orderModel.findOne({ _id: orderId, userId: userId });
        
        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }
        
        return order;
    }

    /**
     * Updates an existing order safely based on user input.
     * @param {string} orderId - The unique ID of the order.
     * @param {string} userId - The ID of the requesting user.
     * @param {Object} updateData - The partial data containing fields to update.
     * @throws Error if validation fails.
     */
    async updateOrder(orderId, userId, updateData) {
        const existingOrder = await this.getOrderById(orderId, userId);

        if (!this._validateOrderData(updateData, true)) {
            throw new Error('Invalid order data provided for update');
        }

        const allowedUpdates = ['tip', 'addressX', 'addressY', 'items']; 

        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                existingOrder[field] = updateData[field];
            }
        });

        if (updateData.items !== undefined || updateData.tip !== undefined) {
            try {
                const newTotalPrice = await this._validateAndCalculateOrder(existingOrder);
                existingOrder.totalPrice = newTotalPrice;
            } catch (error) {
                throw error; 
            }
        }

        await existingOrder.save();
        
        if (existingOrder.status === 'pending') {
            this._startLifecycleTimer(existingOrder._id);
        }

        return existingOrder;
    }

    /**
     * Cancels/Deletes an order safely from memory.
     * @param {string} orderId - The unique ID of the order.
     * @param {string} userId - The ID of the requesting user.
     */
    async deleteOrder(orderId, userId) {
        await this.getOrderById(orderId, userId); // Validates existence and ownership
        
        const idStr = orderId.toString();
        if (this.activeTimers.has(idStr)) {
            clearTimeout(this.activeTimers.get(idStr));
            this.activeTimers.delete(idStr);
        }

        await orderModel.deleteOne({ _id: orderId });
        
        return true;
    }
}

module.exports = new OrderService();
