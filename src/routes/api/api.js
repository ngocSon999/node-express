const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const authRoute = require('./auth.route');
const { requireAuth } = require('../../middlewares/auth.middleware');

const express = require('express');

const router = express.Router();

router.use('/user', requireAuth, userRoute);
router.use('/role', requireAuth, roleRoute);
router.use('/auth', authRoute);


module.exports = router;