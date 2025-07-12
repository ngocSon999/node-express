const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const roleService = require('../../services/role.service');

exports.getAllRoles = catchAsync(async (req, res, next) => {
    try {
        const roles = await roleService.getAll();
        res.render('role/index', { 
            title: 'Role Management',
            roles: roles.data
        });
    } catch (error) {
        next(error);
    }
});

exports.getCreateForm = catchAsync(async (req, res, next) => {
    try {
        res.render('role/role-create', { 
            title: 'Create New Role'
        });
    } catch (error) {
        next(error);
    }
});

exports.getEditForm = catchAsync(async (req, res, next) => {
    try {
        const role = await roleService.getById(req.params.id);
        res.render('role/role-edit', { 
            title: 'Edit Role',
            role: role.data
        });
    } catch (error) {
        next(error);
    }
});