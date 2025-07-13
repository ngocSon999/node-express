const { db, connection } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');

const groupPermissionsByModule = (permissions) => {
  const modules = {};

  permissions.forEach(permission => {
    // Tách từ cuối: 'create user' → ['create', 'user']
    const parts = permission.name.split(' ');
    const module = parts[parts.length - 1]; // lấy 'user' hoặc 'role'

    if (!modules[module]) {
      modules[module] = [];
    }

    modules[module].push(permission);
  });

  // Sắp xếp theo tên action trong mỗi module (optional)
  Object.keys(modules).forEach(key => {
    modules[key].sort((a, b) => a.name.localeCompare(b.name));
  });
 
  return modules;
};


module.exports.getAll = async () => {
    try {
        const PermissionModel = db[modelName.permission];
        const permissions = await PermissionModel.findAll({
            order: [['name', 'ASC']]
        });

        const plainPermissions = permissions.map(permission => permission.get({ plain: true }));
        const groupedPermissions = groupPermissionsByModule(plainPermissions);

        return {
            success: true,
            data: plainPermissions,
            groupedData: groupedPermissions
        };
    } catch (error) {
        console.error('Error getting permissions:', error);
        return {
            success: false,
            message: 'Failed to get permissions'
        };
    }
};

module.exports.findByIds = async (ids) => {
    try {
        const PermissionModel = db[modelName.permission];
        const permissions = await PermissionModel.findAll({
            where: {
                id: ids
            }
        });

        return permissions.map(permission => permission.get({ plain: true }));
    } catch (error) {
        console.error('Error finding permissions by ids:', error);
        throw error;
    }
};

module.exports.getRolePermissions = async (roleId) => {
    try {
        const RoleModel = db[modelName.role];
        const PermissionModel = db[modelName.permission];

        const role = await RoleModel.findByPk(roleId, {
            include: [{
                model: PermissionModel,
                through: { attributes: [] }
            }]
        });

        if (!role) {
            return [];
        }

        return role.permissions.map(permission => permission.get({ plain: true }));
    } catch (error) {
        console.error('Error getting role permissions:', error);
        throw error;
    }
};