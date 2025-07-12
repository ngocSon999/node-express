const authService = require('../services/auth.service');
const { getRoute } = require('../utils/helpers/routes.helper');

module.exports.requireAuth = async (req, res, next) => {

    try {
        let token = req.cookies.token;
        // If not in cookie, try reading from header
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }
        console.log(token)
        // Verify token
        const result = await authService.verifyToken(token);
        
        if (!result.success) {
           return handleUnauthorized(req, res);
        }

        // Add user info to request
        req.user = result.data;
        next();
    } catch (error) {
       return handleUnauthorized(req, res);
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

function handleUnauthorized(req, res) {
  const isApi = req.originalUrl.startsWith('/api');

  if (isApi) {
    return res.status(401).json({
      success: true,
      message: 'Unauthorized',
    });
  }

  const urlLogin = getRoute('login');
  return res.redirect(urlLogin);
}