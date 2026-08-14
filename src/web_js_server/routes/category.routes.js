const express = require('express');
const router = express.Router();
const { Category, POPULAR_CATEGORIES, seedCategories } = require('../models/category.model');

/**
 * Categories Route.
 * Base path: /api/categories
 * Returns the list of available categories from database with _id.
 */
router.get('/', async (req, res) => {
    try {
        let catDocs = await Category.find();
        if (!catDocs || catDocs.length === 0) {
            await seedCategories();
            catDocs = await Category.find();
        }
        return res.status(200).json(catDocs);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
