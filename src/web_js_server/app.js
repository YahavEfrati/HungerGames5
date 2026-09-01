const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const restaurantRoutes = require('./routes/restaurant.routes'); 
const userRoutes = require('./routes/user.routes');
const searchRoutes = require('./routes/search.routes');
const tokenRoutes = require('./routes/token.routes');
const orderRoutes = require('./routes/order.routes');
const tcpClient = require('./client/tcpClient');
const restaurantModel = require('./models/restaurant.model');
const productModel = require('./models/product.model');
const categoryRoutes = require('./routes/category.routes');
const { seedCategories } = require('./models/category.model');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);



// Catch-all middleware for handling undefined routes (404 Not Found).
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error-handling middleware for catching and responding to errors.
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON format in request body" });
    }

    // Handle all other unexpected errors
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

// Define the port, allowing for environment variables (maybe useful for deployment)
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/hungergames';

mongoose.connect(MONGO_URI).then(async () => {
    // Seed initial categories into the database
    await seedCategories();
    // Connect to the TCP server before starting the HTTP server
    app.listen(PORT, () => {
    console.log(`[HTTP] Server is running on port ${PORT}`);

    tcpClient.connect()
        .then(() => {
            console.log('[TCP] Successfully connected to recommendation server on startup.');
        })
        .catch((err) => {
            console.error('[TCP] Failed to connect on startup:', err.message);
        });
    });
});