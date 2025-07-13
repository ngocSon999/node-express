const { db } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // check user login
            if (!req.user) {
                if (req.xhr || req.originalUrl.startsWith('/api')) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized'
                    });
                }

                req.flash('error', 'Bạn chưa đăng nhập');
                return res.redirect('/admin/auth/login');
            }

            const UserModel = db[modelName.user];
            const RoleModel = db[modelName.role];
            const PermissionModel = db[modelName.permission];

            const user = await UserModel.findByPk(req.user.id, {
                include: [{
                    model: RoleModel,
                    include: [{
                        model: PermissionModel,
                        through: { attributes: [] }
                    }]
                }]
            });

            if (!user) {
                if (req.xhr || req.originalUrl.startsWith('/api')) {
                    return res.status(401).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                req.flash('error', 'Không tìm thấy người dùng');
                return res.redirect('/admin/auth/login');
            }

            const hasPermission = user.roles.some(role =>
                role.permissions.some(permission =>
                    permission.name === requiredPermission
                )
            );

            if (!hasPermission) {
                if (req.xhr || req.originalUrl.startsWith('/api')) {
                    return res.status(403).json({
                        success: false,
                        message: 'Permission denied'
                    });
                }

                req.flash('error', 'Bạn không có quyền truy cập chức năng này');
                return res.redirect('/admin/403');
            }

            // Có quyền → tiếp tục
            next();

        } catch (error) {
            console.error('Error checking permission:', error);

            if (req.xhr || req.originalUrl.startsWith('/api')) {
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }

            req.flash('error', 'Lỗi hệ thống, vui lòng thử lại sau');
            return res.redirect('/admin/403');
        }
    };
};

module.exports = {
    checkPermission
};
