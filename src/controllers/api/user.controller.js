const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const userService = require('../../services/user.service');


exports.create = catchAsync(async (req, res, next) => {
  try {
    // Convert roles array from form-data to normal array
    if (req.body['roles[]']) {
      req.body.roles = Array.isArray(req.body['roles[]']) ? 
        req.body['roles[]'] : [req.body['roles[]']];
      delete req.body['roles[]'];
    }

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
    // Convert roles array from form-data to normal array
    if (req.body['roles[]']) {
      req.body.roles = Array.isArray(req.body['roles[]']) ? 
        req.body['roles[]'] : [req.body['roles[]']];
      delete req.body['roles[]'];
    }

    const result = await userService.update(req);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error updating user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});
