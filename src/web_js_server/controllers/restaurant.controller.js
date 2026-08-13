const restaurantService = require('../services/restaurant.service');
const userService = require('../services/user.service');

/**
 * Helper function to transform a restaurant document into a frontend-friendly DTO.
 * Strips the 'products' array and maps populated category objects to their string names.
 * @param {Object} restaurantDoc - The raw Mongoose document.
 * @returns {Object} The clean DTO.
 */
function transformRestaurantDTO(restaurantDoc) {
    const dto = restaurantDoc.toObject ? restaurantDoc.toObject() : { ...restaurantDoc };
    
    // The frontend expects products to be fetched separately, so we remove them
    delete dto.products;

    // Retain populated Category objects with _id, name, icon or keep strings
    if (dto.categories && Array.isArray(dto.categories)) {
        dto.categories = dto.categories.map(cat => {
            if (cat && typeof cat === 'object') {
                return {
                    _id: String(cat._id || cat.id),
                    name: cat.name || '',
                    icon: cat.icon || ''
                };
            }
            return cat;
        });
    }
    
    return dto;
}

/**
 * Restaurant Controller.
 * Handles incoming HTTP requests, validates input, and formats HTTP responses.
 */
class RestaurantController {
    /**
     * For all the controller methods, we will:
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */

     // Handles the creation of a new restaurant.
    async createRestaurant(req, res) {
        const { name, description, addressX, addressY, phone, kosher, working_hours, image, categories } = req.body;
        const authUserId = req.user._id;

        try {
            const newRestaurant = await restaurantService.createRestaurant({
                name,
                description,
                addressX,
                addressY,
                phone,
                kosher,
                working_hours,
                categories,
                image,
                ownerId: authUserId
            });

            // Return 201 Created with the Location header using _id
            return res.status(201)
                .location(`/api/restaurants/${newRestaurant._id}`)
                .json(transformRestaurantDTO(newRestaurant));
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Retrieves all restaurants.
    async getRestaurantsList(req, res) {
        const { sort, lat, lng } = req.query;

        try {
            const restaurants = await restaurantService.getAllRestaurants();

            // Transform all documents to DTOs (which handles category mapping and product removal)
            let processedRestaurants = restaurants.map(r => transformRestaurantDTO(r));

            if (lat && lng) {
                const userLat = parseFloat(lat);
                const userLng = parseFloat(lng);

                if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
                    processedRestaurants = processedRestaurants.map(restaurant => {
                        const restLat = parseFloat(restaurant.addressX || 0);
                        const restLng = parseFloat(restaurant.addressY || 0);
                        
                        const degDistance = Math.sqrt(Math.pow(restLat - userLat, 2) + Math.pow(restLng - userLng, 2));
                        const kmDistance = parseFloat((degDistance * 111).toFixed(1));
                        
                        return { ...restaurant, distance: kmDistance };
                    });
                }
            }

            if (sort === 'topRated') {
                processedRestaurants.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
            }
            else if (sort === 'nearby') {
                if (!lat || !lng || Number.isNaN(parseFloat(lat)) || Number.isNaN(parseFloat(lng))) {
                    return res.status(400).json({ 
                        error: 'Coordinates are required and must be valid numbers for nearby sorting' 
                    });
                }
                processedRestaurants.sort((a, b) => a.distance - b.distance);
            } 
            else if (sort) {
                return res.status(400).json({ 
                    error: "Invalid query parameters. Use 'sort=topRated' or 'sort=nearby&lat=<latitude>&lng=<longitude>'" 
                });
            }

            return res.status(200).json(processedRestaurants);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Retrieves a single restaurant by its ID.
    async getRestaurantById(req, res) {
        try {
            const resById = await restaurantService.getRestaurantById(req.params.id);
            if (!resById) {
                return res.status(404).json({ error: "Restaurant not found" });
            }

            const cleanRestaurant = transformRestaurantDTO(resById);

            // Calculate estimated delivery time if user is authenticated AND not a restaurant manager
            if (req.user) {
                const user = await userService.getUserById(req.user._id);
                if (user && user.role !== 'restaurant_owner' && typeof user.addressX === 'number' && typeof user.addressY === 'number') {
                    const dx = user.addressX - resById.addressX;
                    const dy = user.addressY - resById.addressY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    cleanRestaurant.estimatedDeliveryTime = Math.ceil(distance * 5) + 15;
                }
            }

            return res.status(200).json(cleanRestaurant);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Retrieves restaurants by category
    async getRestaurantsByCategory(req, res) {
        try {
            const category = req.params.category;
            const restaurants = await restaurantService.getRestaurantsByCategory(category);

            const cleanRestaurants = restaurants.map(r => transformRestaurantDTO(r));
            return res.status(200).json(cleanRestaurants);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Updates an existing restaurant.
    async updateRestaurant(req, res) {
        const id = req.params.id;
        const updateData = req.body;
        
        try {
            const updatedRestaurant = await restaurantService.updateRestaurant(id, updateData);
            if (!updatedRestaurant) {
                return res.status(404).json({ error: "Restaurant not found" });
            }
            
            return res.status(200).json(transformRestaurantDTO(updatedRestaurant));
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Deletes a restaurant by its ID.
    async deleteRestaurant(req, res) {
        const id = req.params.id;
        try {
            const isDeleted = await restaurantService.deleteRestaurant(id);
            if (!isDeleted) {
                return res.status(404).json({ error: "Restaurant not found" });
            }
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

// Export a singleton instance of the controller
module.exports = new RestaurantController();