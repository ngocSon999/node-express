const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const authService = require('../../services/auth.service');


exports.postLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result);
});

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token'); 
        return res.status(200).json({
            success: true,
            message: 'logout successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
