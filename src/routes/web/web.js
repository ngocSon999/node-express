const express = require('express');
const userWebRoutes = require('./user.route');
const roleWebRoutes = require('./role.route');
const authRoutes = require('./auth.route');
const { requireAuth } = require('../../middlewares/auth.middleware');
const router = express.Router();

// Dashboard route
router.get('/', requireAuth, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        user: req.user // Pass authenticated user to view
    });
});


// User management routes
router.use('/user', requireAuth, userWebRoutes);

// Role management routes
router.use('/role', requireAuth, roleWebRoutes);

router.use('/auth', authRoutes);

module.exports = router;
