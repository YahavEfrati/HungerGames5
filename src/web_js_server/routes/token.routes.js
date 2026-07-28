const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * Token Routes (Login)
 * Base path: /api/tokens
 */
router.route('/')
    .post(authController.login.bind(authController));

module.exports = router;