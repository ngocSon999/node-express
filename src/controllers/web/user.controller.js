const { catchAsync } = require('../../utils/helpers/handleError/catchAsync');
const userService = require('../../services/user.service');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers(req);

    res.render('user/index', {
        title: 'User Management',
        users
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
exports.getEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.findByPk(id, { raw: true });

    if (!user) return res.status(404).render('404', { message: 'User not found' });

    res.render('user/user-edit', {
      title: 'Edit User',
      user
    });
  } catch (error) {
    next(error);
  }
};

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
