const productService = require('../services/product.service');
const tcpClient = require('../client/tcpClient');

/**
 * Product Controller.
 * Handles incoming HTTP requests, validates input, and formats HTTP responses for products.
 */
class ProductController {
    
    /**
     * Retrieves all products for a specific restaurant.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */

    // --- GET /api/restaurants/:id/products ---
    async getProductsByRestaurant(req, res) {
        try {
            const restaurantId = req.params.id;
            const products = await productService.getProductsByRestaurant(restaurantId);
            
            if (products) {
                return res.status(200).json(products);
            }
            return res.status(404).json({error: 'Restaurant not found'});
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // --- POST /api/restaurants/:id/products ---
    async createProduct(req, res) {
        const restaurantId = req.params.id;
        const { name, price, description, image } = req.body;

        try {
            const newProduct = await productService.createProductForRestaurant(restaurantId, { name, price, description, image });

            if (newProduct) {
                return res.status(201)
                          .location(`/api/restaurants/${restaurantId}/products/${newProduct._id}`)
                          .json(newProduct);
            }

            return res.status(404).json({ error: 'Restaurant not found' });
        } catch (error) {
            if (error.message.includes('Restaurant')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    // --- GET /api/restaurants/:id/products/:pId ---
    async getProductById(req, res) {
        try {
            const { id: restaurantId, pId: productId } = req.params;
            const product = await productService.getProductById(restaurantId, productId);

            if (!product) {
                return res.status(404).json({ error: 'Restaurant or Product not found' });
            }

            const userId = req.user ? req.user._id : null; 

            if (userId) {
                (async () => {
                    try {
                        const patchPayload = `PATCH ${userId} ${productId}\n`;
                        const response = await tcpClient.send(patchPayload);

                        if (response && response.includes('404')) {
                            const postPayload = `POST ${userId} ${productId}\n`;
                            await tcpClient.send(postPayload);
                        }
                    } catch (err) {
                        console.error(`[Analytics Error] Network/TCP failure for product ${productId}:`, err.message);
                    }
                })().catch(err => {
                    console.error(`[Analytics Error] Unexpected error for product ${productId}:`, err.message);
                });
            } else {
                console.warn('[Analytics Warning] No user ID provided in Authorization header. Skipping analytics reporting.');
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // --- PATCH /api/restaurants/:id/products/:pId ---
    async updateProduct(req, res) {
        const { id: restaurantId, pId: productId } = req.params;
        const updateData = req.body;

        try {
            const updateProduct = await productService.updateProduct(restaurantId, productId, updateData);
            
            if (!updateProduct) {
                return res.status(404).json({ error: 'Restaurant or Product not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // --- DELETE /api/restaurants/:id/products/:pId ---
    async deleteProduct(req, res) {
        try {
            const { id: restaurantId, pId: productId } = req.params;
            const success = await productService.deleteProduct(restaurantId, productId);

            if (!success) {
                return res.status(404).json({ error: 'Restaurant or Product not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

// Export a singleton instance of the controller
module.exports = new ProductController();
