const express = require('express');
const authController = require('../../controllers/web/auth.controller');
const { guestOnly, requireAuth } = require('../../middlewares/auth.middleware');

const authWebRoute = express.Router();

// Guest only routes
authWebRoute.get('/login', guestOnly, authController.getLogin);
authWebRoute.post('/login', guestOnly, authController.postLogin);

// Authenticated routes
authWebRoute.get('/logout', requireAuth, authController.logout);

module.exports = authWebRoute;