const express = require('express');
const router = express.Router();
const categories = require('../models/category.model');

/**
 * Categories Route.
 * Base path: /api/categories
 * Returns the fixed list of available categories.
 */
router.get('/', (req, res) => {
    return res.status(200).json(categories);
});

module.exports = router;
