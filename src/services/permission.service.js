const { db, connection } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');

module.exports.getAll = async () => {
    try {
        const PermissionModel = db[modelName.permission];
        const permissions = await PermissionModel.findAll({
            order: [['name', 'ASC']]
        });

        return {
            success: true,
            data: permissions.map(permission => permission.get({ plain: true }))
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