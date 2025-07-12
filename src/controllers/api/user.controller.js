const { catchAsync } = require('../utils/helpers/handleError/catchAsync');
const userService = require('../services/user.service');


exports.create = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.create(req);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error creating user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.update = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.update(req);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error updateting user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});
