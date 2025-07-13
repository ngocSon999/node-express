const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const authService = require('../../services/auth.service');
const userService = require('../../services/user.service');

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

exports.me = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await userService.getUserWithRoles(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Loại bỏ password trước khi trả về
    const { password, ...userWithoutPassword } = user.toJSON();

    return res.status(200).json({
        success: true,
        data: userWithoutPassword
    });
});
