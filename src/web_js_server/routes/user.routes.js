const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth  } = require('../middlewares/auth.middleware');

/**
 * User Routes.
 * Base path: /api/users
 */

router.route('/')
    .post(userController.createUser.bind(userController));

router.route('/:id')
    .get(requireAuth, userController.getUserById.bind(userController))
    .patch(requireAuth, userController.updateUser.bind(userController));

module.exports = router;