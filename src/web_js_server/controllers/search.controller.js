const searchService = require('../services/search.service');

/**
 * Search Controller.
 * Handles incoming search requests and delegates to the Search Service.
 */
class SearchController {
    
    /**
     * Handles the search request and returns matching restaurants and products.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
    */
    searchGlobal(req, res) {
        const query = req.params.query

        // Validate that the query string is provided and not empty (we can also trim it to check for whitespace-only queries)
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: "Search query string is required" });
        }

        const results = searchService.searchGlobal(query);

        return res.status(200).json(results);
    }
}

module.exports = new SearchController();