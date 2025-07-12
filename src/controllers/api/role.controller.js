const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const roleService = require('../../services/role.service');

exports.create = catchAsync(async (req, res, next) => {
  try {
    const result = await roleService.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error creating role';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.update = catchAsync(async (req, res, next) => {
  try {
    const result = await roleService.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error updating role';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

exports.delete = catchAsync(async (req, res, next) => {
  try {
    const result = await roleService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error deleting role';
    res.status(500).json({
      success: false, 
      message,
    });
  }
});

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    const result = await roleService.getAll();
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error getting roles';
    res.status(500).json({
      success: false,
      message, 
    });
  }
});

exports.getById = catchAsync(async (req, res, next) => {
  try {
    const result = await roleService.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error getting role';
    res.status(500).json({
      success: false,
      message,
    });
  }
});