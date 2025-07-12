const express = require('express');
const userWebRoutes  = require('./user.route');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page', name: 'Hiep' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.use('/user', userWebRoutes )




module.exports = router;
