const userRoute = require('./user.route');
const express = require('express');

const router = express.Router();

router.use('/user', userRoute)

module.exports = router;