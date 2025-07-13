const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const roleService = require('../../services/role.service');

exports.create = catchAsync(async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    const result = await roleService.create({ name, description, permissions });
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: result.data
    });
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
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    const result = await roleService.update(id, { name, description, permissions });
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: result.data
    });
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
    const { id } = req.params;
    const result = await roleService.delete(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
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
    res.status(200).json({
      success: true,
      data: result.data
    });
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
    const { id } = req.params;
    const result = await roleService.getById(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    const message = error?.parent?.sqlMessage || error.message || 'Error getting role';
    res.status(500).json({
      success: false,
      message,
    });
  }
});