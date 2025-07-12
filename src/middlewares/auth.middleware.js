const authService = require('../services/auth.service');
const { getRoute } = require('../utils/helpers/routes.helper');

module.exports.requireAuth = async (req, res, next) => {

    try {
        // Get token from cookie
        const token = req.cookies.token;
        // Verify token
        const result = await authService.verifyToken(token);
        
        if (!result.success) {
            const urlLogin = getRoute('login');
            return res.redirect(urlLogin);
        }

        // Add user info to request
        req.user = result.data;
        next();
    } catch (error) {
        const urlLogin = getRoute('login');
        return res.redirect(urlLogin);
    }
};

module.exports.guestOnly = async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        const result = await authService.verifyToken(token);
        if (result.success) {
            const urlDashboard = getRoute('dashboard');
            return res.redirect(urlDashboard);
        } else {
            // Token expired or invalid → delete token from cookie
            res.clearCookie('token');
        }
    }

    next();
};