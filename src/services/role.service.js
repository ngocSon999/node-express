const { db, connection } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');
const permissionService = require('./permission.service');

module.exports.create = async (data) => {
  const RoleModel = db[modelName.role];
  const RolePermissionModel = db[modelName.role_permission];

  const result = await connection.transaction(async (t) => {
    // Create role
    const role = await RoleModel.create({
      name: data.name
    }, { transaction: t });

    // Assign permissions if provided
    if (data.permissions && data.permissions.length > 0) {
      const rolePermissions = data.permissions.map(permissionId => ({
        role_id: role.id,
        permission_id: permissionId
      }));
      await RolePermissionModel.bulkCreate(rolePermissions, { transaction: t });
    }

    return role;
  });

  return {
    success: true,
    message: 'Role created successfully',
    data: result.get({ plain: true })
  };
};

module.exports.update = async (id, data) => {
  const RoleModel = db[modelName.role];
  const RolePermissionModel = db[modelName.role_permission];

  const result = await connection.transaction(async (t) => {
    const role = await RoleModel.findByPk(id);
    
    if (!role) {
      throw new Error('Role not found');
    }

    // Update role name
    await role.update({ name: data.name }, { transaction: t });

    // Update permissions if provided
    if (data.permissions) {
      // Remove existing permissions
      await RolePermissionModel.destroy({
        where: { role_id: id },
        transaction: t
      });

      // Add new permissions
      if (data.permissions.length > 0) {
        const rolePermissions = data.permissions.map(permissionId => ({
          role_id: id,
          permission_id: permissionId
        }));
        await RolePermissionModel.bulkCreate(rolePermissions, { transaction: t });
      }
    }

    return role;
  });

  return {
    success: true,
    message: 'Role updated successfully',
    data: result.get({ plain: true })
  };
};

module.exports.delete = async (id) => {
  const RoleModel = db[modelName.role];
  const role = await RoleModel.findByPk(id);

  if (!role) {
    throw new Error('Role not found');
  }

  await role.destroy();
  return {
    success: true,
    message: 'Role deleted successfully'
  };
};

module.exports.getAll = async () => {
  const RoleModel = db[modelName.role];
  const PermissionModel = db[modelName.permission];

  const roles = await RoleModel.findAll({
    include: [{
      model: PermissionModel,
      through: { attributes: [] }
    }],
    order: [['name', 'ASC']]
  });

  return {
    success: true,
    data: roles.map(role => role.get({plain: true}))
  };
};

module.exports.getById = async (id) => {
  const RoleModel = db[modelName.role];
  const PermissionModel = db[modelName.permission];

  const role = await RoleModel.findByPk(id, {
    include: [{
      model: PermissionModel,
      through: { attributes: [] }
    }]
  });

  if (!role) {
    throw new Error('Role not found');
  }

  return {
    success: true,
    data: role.get({ plain: true })
  };
};