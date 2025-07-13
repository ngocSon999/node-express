const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const roleService = require('../../services/role.service');
const permissionService = require('../../services/permission.service');

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
        const permissions = await permissionService.getAll();
        res.render('role/role-create', { 
            title: 'Create New Role',
            permissions: permissions.data
        });
    } catch (error) {
        next(error);
    }
});

exports.getEditForm = catchAsync(async (req, res, next) => {
    try {
        const [role, permissions] = await Promise.all([
            roleService.getById(req.params.id),
            permissionService.getAll()
        ]);

        res.render('role/role-edit', { 
            title: 'Edit Role',
            role: role.data,
            permissions: permissions.data,
            helpers: {
                isSelected: function(permissionId, rolePermissions) {
                    return rolePermissions && rolePermissions.some(p => p.id === permissionId);
                }
            }
        });
    } catch (error) {
        next(error);
    }
});