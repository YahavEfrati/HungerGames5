const express = require('express')
const router = express.Router();
const searchController = require('../controllers/search.controller');

/**
 * Search Routes.
 * Base
 * path: /api/search
*/

router.route('/:query')
    .get(searchController.searchGlobal.bind(searchController));

module.exports = router;