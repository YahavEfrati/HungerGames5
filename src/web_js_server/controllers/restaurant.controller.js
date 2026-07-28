const restaurantService = require('../services/restaurant.service');
const userModel = require('../models/user.model');

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
    createRestaurant(req, res) {
        const { name, description, addressX, addressY, phone, kosher , working_hours, image, categories } = req.body;

        try {
            // Create the restaurant using the service layer (validation handled by service)
            const newRestaurant = restaurantService.createRestaurant({
                name,
                description,
                addressX,
                addressY,
                phone,
                kosher,
                working_hours,
                categories,
                image,
                ownerId: req.user.id
            });

            // Return 201 Created with the Location header pointing to the new resource
            return res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Retrieves all restaurants.
    getRestaurantsList(req, res) {
        const { sort, lat, lng } = req.query;

        const restaurants = restaurantService.getAllRestaurants();

        // The response will be processed based on the query parameters provided by the client.
        let processedRestaurants = [...restaurants];

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
        // if the user requested sorting by top rated, we sort the restaurants by their rating in descending order
        if (sort === 'topRated') {
            processedRestaurants.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
        }
        // if the user requested sorting by nearby, we need to ensure lat and lng are provided
        else if (sort === 'nearby') {
            if (!lat || !lng || Number.isNaN(parseFloat(lat)) || Number.isNaN(parseFloat(lng))) {
                return res.status(400).json({ error: 'Coordinates are required and must be valid numbers for nearby sorting' });
            }

            processedRestaurants.sort((a, b) => a.distance - b.distance);
        } 
        else if (!sort) {
            
        }
        // if the query parameters are invalid, we return a 400 Bad Request
        else {
            return res.status(400).json({ 
                error: "Invalid query parameters. Use 'sort=topRated' or 'sort=nearby&lat=<latitude>&lng=<longitude>'" 
            });
        }

        // Remove the 'products' field from each restaurant object before sending the response
        const cleanRestaurants = processedRestaurants.map(({ products, ...info }) => info);
        
        return res.status(200).json(cleanRestaurants);
    }

    // Retrieves a single restaurant by its ID.
    getRestaurantById(req, res) {
        const resById = restaurantService.getRestaurantById(req.params.id);
		if(!resById){
			return res.status(404).json({ error: "Restaurant not found" })
		}

        // Remove the 'products' field from the restaurant object before sending the response
        const { products, ...restaurantWithoutProducts } = resById;

        // Calculate estimated delivery time if user is authenticated AND not a restaurant manager
        if (req.user) {
            const user = userModel.getUserById(req.user.id);
            if (user && user.role !== 'restaurant_owner' && typeof user.addressX === 'number' && typeof user.addressY === 'number') {
                const dx = user.addressX - resById.addressX;
                const dy = user.addressY - resById.addressY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                restaurantWithoutProducts.estimatedDeliveryTime = Math.ceil(distance * 5) + 15;
            }
        }

        return res.status(200).json(restaurantWithoutProducts);
    }

    getRestaurantsByCategory(req, res) {
        const category = req.params.category;
        const restaurants = restaurantService.getRestaurantsByCategory(category);

        const cleanRestaurants = restaurants.map(restaurant => {
            const { products, ...restaurantInfo } = restaurant;
            return restaurantInfo;
        });
        return res.status(200).json(cleanRestaurants);
    }

    // Updates an existing restaurant.
    updateRestaurant(req, res) {
		const id = req.params.id;
		const updateData = req.body;
		
		try {
            const updatedRestaurant = restaurantService.updateRestaurant(id, updateData);
			if(!updatedRestaurant) {
                return res.status(404).json({ error: "Restaurant not found" });
            }
            
            // Clean the products map into an array for the client response
            const cleanRestaurant = { 
                ...updatedRestaurant, 
                products: updatedRestaurant.products instanceof Map ? Array.from(updatedRestaurant.products.values()) : [] 
            };
			return res.status(200).json(cleanRestaurant);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
    }


    // Deletes a restaurant by its ID.
    deleteRestaurant(req, res) {
		const id = req.params.id;
	
		if(!restaurantService.deleteRestaurant(id)){
			return res.status(404).json({ error: "Restaurant not found" });
		}
		return res.status(204).end();
    }
}

// Export a singleton instance of the controller
module.exports = new RestaurantController();