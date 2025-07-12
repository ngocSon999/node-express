const express = require('express');
const authController = require('../../controllers/web/auth.controller');
const { guestOnly, requireAuth } = require('../../middlewares/auth.middleware');

const authWebRoute = express.Router();

// Guest only routes
authWebRoute.get('/login', guestOnly, authController.getLogin);

module.exports = authWebRoute;