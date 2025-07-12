const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const authService = require('../../services/auth.service');
const { getRoute } = require('../../utils/helpers/routes.helper');

exports.getLogin = catchAsync(async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: 'auth'
    });
});

exports.postLogin = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result.success) {
        return res.render('auth/login', {
            title: 'Login',
            layout: 'auth',
            error: result.message,
            email
        });
    }

    // Set token in cookie
    res.cookie('token', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.redirect(getRoute('dashboard'));
});

exports.logout = catchAsync(async (req, res) => {
    res.clearCookie('token'); 
    res.redirect(getRoute('login'));
});