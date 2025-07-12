const express = require('express');
const userWebRoutes = require('./user.route');
const roleWebRoutes = require('./role.route');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.use('/user', userWebRoutes);
router.use('/role', roleWebRoutes);

module.exports = router;
