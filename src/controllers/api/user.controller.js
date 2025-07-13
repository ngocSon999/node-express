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
    res.status(201).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error creating user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getAll();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error getting users';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.getById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.getById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error getting user';
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

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error updating user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.delete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.delete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error deleting user';
    res.status(500).json({
      success: false,
      message,
    });
  }
});
