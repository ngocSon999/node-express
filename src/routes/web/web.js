const express = require('express');
const userWebRoutes = require('./user.route');
const roleWebRoutes = require('./role.route');
const authRoutes = require('./auth.route');
const { requireAuth } = require('../../middlewares/auth.middleware');
const setUser = require('../../middlewares/setUser.middleware'); 
const router = express.Router();

// Dashboard route
router.get('/', requireAuth, setUser, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
    });
});


// User management routes
router.use('/user', [requireAuth, setUser], userWebRoutes);

// Role management routes
router.use('/role', [requireAuth, setUser], roleWebRoutes);

router.use('/auth', authRoutes);

module.exports = router;
