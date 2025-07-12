const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const userService = require('../../services/user.service');
const roleService = require('../../services/role.service');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers(req);
    const roles = await roleService.getAll();

    res.render('user/index', {
        title: 'User Management',
        users,
        roles: roles.data,
        helpers: {
            isSelected: function(roleId, userRoles) {
                return userRoles && userRoles.some(role => role.id === roleId);
            }
        }
    });
});

exports.getCreate = catchAsync(async (req, res, next) => {
    const roles = await roleService.getAll();
   
    res.render('user/user-create', {
        title: 'Create User',
        roles
    });
});

exports.getDetail = catchAsync(async (req, res, next) => {
  const user = await userService.getDetail(req.params.id);

  if (!user) {
    return res.status(404).render('404', { message: 'User not found' });
  }

  res.render('user/user-detail', {
    title: 'User Detail',
    user
  });
});

// Form edit người dùng
exports.getEdit = catchAsync(async (req, res, next) => {
    const user = await userService.getUserWithRoles(req.params.id);
    const roles = await roleService.getAll();

    res.render('user/user-edit', {
        title: 'Edit User',
        user,
        roles: roles.data,
        helpers: {
            isSelected: function(roleId, userRoles) {
                return userRoles && userRoles.some(role => role.id === roleId);
            }
        }
    });
});

// Xóa người dùng
exports.getDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.destroy(id);

    res.redirect('/admin/user');
  } catch (error) {
    next(error);
  }
};
