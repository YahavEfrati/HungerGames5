const mongoose = require('mongoose');
const User = require('./models/user.model');
const Restaurant = require('./models/restaurant.model');
const Product = require('./models/product.model');
const { Category } = require('./models/category.model');

async function seedDatabase() {
    try {
        const restaurantCount = await Restaurant.countDocuments();
        if (restaurantCount > 0) {
            console.log('Database already contains data, skipping seed.');
            return;
        }

        console.log('Seeding database with mock data...');

        // 1. Fetch categories to obtain their ObjectIds
        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('No categories found. Please ensure categories are seeded first.');
            return;
        }

        // 2. Create a mock user to serve as the required ownerId for restaurants
        const mockOwner = await User.create({
            username: `admin`,
            password: '1234',
            name: 'Mock Restaurant Owner',
            phone: '050-1234567',
            addressX: 32.0853,
            addressY: 34.7818,
            role: 'restaurant_owner'
        });

        const restaurantsToInsert = [];
        const productsToInsert = [];

        // Generate 20 distinct restaurants
        for (let i = 0; i < 20; i++) {
            const categoryIndex = i % categories.length;
            const category = categories[categoryIndex];
            
            // Create the Restaurant ObjectId beforehand so we can safely reference it in Products
            const restaurantId = new mongoose.Types.ObjectId();
            
            restaurantsToInsert.push({
                _id: restaurantId,
                name: `The Great Restaurant ${i + 1}`,
                description: `Experience the amazing flavors at our branch ${i + 1}.`,
                addressX: 32.0 + (Math.random() * 0.1),
                addressY: 34.7 + (Math.random() * 0.1),
                phone: `050-00000${i < 10 ? '0' + i : i}`,
                kosher: i % 2 === 0,
                ownerId: mockOwner._id,
                working_hours: '08:00 - 22:00',
                image: `https://picsum.photos/seed/restaurant_${i}/800/600`,
                
                // As per Restaurant Schema: `categories` is an array of Category ObjectIds
                categories: [category._id], 
                
                minimumOrder: 20 + i,
                rating: parseFloat((Math.random() * 5 + 5).toFixed(1))
                
                // Note: The Restaurant Schema DOES NOT have a `products` array field, 
                // so we do not embed or push products here.
            });

            // Generate exactly 5 products for each restaurant
            for (let j = 0; j < 5; j++) {
                productsToInsert.push({
                    // As per Product Schema: `restaurantId` is a single ObjectId referencing Restaurant
                    restaurantId: restaurantId,
                    
                    name: `Delicious Product ${j + 1} - Rest ${i + 1}`,
                    description: `This is a highly recommended dish number ${j + 1} from restaurant ${i + 1}.`,
                    price: 15 + (j * 5) + (i * 2),
                    image: `https://picsum.photos/seed/product_${i}_${j}/400/400`
                });
            }
        }

        // 3. Insert the Restaurant documents
        await Restaurant.insertMany(restaurantsToInsert);

        // 4. Insert the Product documents, which now correctly reference the inserted Restaurants
        await Product.insertMany(productsToInsert);

        console.log('Database successfully seeded with 20 restaurants and 100 products!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

module.exports = { seedDatabase };
