const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const express = require('express');

const router = express.Router();

router.use('/user', userRoute);
router.use('/role', roleRoute);

module.exports = router;