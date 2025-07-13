const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const authService = require('../../services/auth.service');
const { getRoute } = require('../../utils/helpers/routes.helper');

exports.getLogin = catchAsync(async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: 'auth'
    });
});