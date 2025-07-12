const express = require('express');
const authController = require('../../controllers/api/auth.controller');
const { requireAuth } = require('../../middlewares/auth.middleware')

const router = express.Router();

router.post('/login', authController.postLogin);
// Authenticated routes
router.get('/logout', requireAuth, authController.logout);

module.exports = router;