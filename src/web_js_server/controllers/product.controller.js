const { deleteProduct } = require('../services/product.service');
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
    getProductsByRestaurant(req, res) {
        // 1. Extract the restaurant ID from the route parameters.
        const restaurantId = req.params.id;
        
        // 2. Call service to fetch products for the restaurant
        const products = productService.getProductsByRestaurant(restaurantId);
        
        // 3. Return 200 OK with the array of products in JSON format
        if(products){
            return res.status(200).json(products);
        }
        
        return res.status(404).json({error: 'Restaurant not found'});

    
    }

    // --- POST /api/restaurants/:id/products ---
    createProduct(req, res){
        const restaurantId = req.params.id;

        const {name, price, description, image } = req.body;

        try {
            const newProduct = productService.createProductForRestaurant(restaurantId, {name, price, description, image});

            if(newProduct){
                return res.status(201)
                          .location(`/api/restaurants/${restaurantId}/products/${newProduct.id}`)
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
    getProductById(req, res){
        const {id: restaurantId, pId: productId} = req.params;
        const product = productService.getProductById(restaurantId, productId);

        if(!product){
            return res.status(404).json({ error: 'Restaurant or Product not found' });
        }

        const userId = req.user? req.user.id: null; // Extract user ID from the authenticated request

        // Execute background notification only if the user is authenticated
        if (userId) {
            (async () => {
                try {
                    // Step 1: Attempt to update the existing record using PATCH
                    const patchPayload = `PATCH ${userId} ${productId}\n`;
                    const response = await tcpClient.send(patchPayload);

                    // Step 2: Check if the C++ server responded with a 404 status string
                    if (response && response.includes('404')) {
                        // Fallback: User does not exist, insert a new record using POST
                        const postPayload = `POST ${userId} ${productId}\n`;
                        await tcpClient.send(postPayload);
                    }
                } catch (err) {
                    // This catch block handles actual network/socket disconnections, not 404 messages
                    console.error(`[Analytics Error] Network/TCP failure for product ${productId}:`, err.message);
                }
            })().catch(err => {
                // Catch any unexpected errors in the async function
                console.error(`[Analytics Error] Unexpected error for product ${productId}:`, err.message);
            });
        }else {
            console.warn('[Analytics Warning] No user ID provided in Authorization header. Skipping analytics reporting.');
        }

        return res.status(200).json(product);
    }

    // --- PATCH /api/restaurants/:id/products/:pId ---
    updateProduct(req, res){
        const{id: restaurantId, pId: productId} = req.params;
        const updateData = req.body;

        try {
            const updateProduct = productService.updateProduct(restaurantId, productId, updateData);
            
            if (!updateProduct) {
                return res.status(404).json({ error: 'Restaurant or Product not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // --- DELETE /api/restaurants/:id/products/:pId ---
    deleteProduct(req,res){
        const {id:restaurantId, pId: productId} = req.params;
        const success = productService.deleteProduct(restaurantId, productId);

        if(!success){
            return res.status(404).json({ error: 'Restaurant or Product not found' });
        }
        return res.status(204).send();
    }
}

// Export a singleton instance of the controller
module.exports = new ProductController();
