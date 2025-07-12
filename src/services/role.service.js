const { db } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');

module.exports.create = async (data) => {
  const RoleModel = db[modelName.role];
  const role = await RoleModel.create(data);
  return {
    success: true,
    message: 'Role created successfully',
    data: role
  };
};

module.exports.update = async (id, data) => {
  const RoleModel = db[modelName.role];
  const role = await RoleModel.findByPk(id);
  
  if (!role) {
    throw new Error('Role not found');
  }

  await role.update(data);
  return {
    success: true,
    message: 'Role updated successfully',
    data: role
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
  const roles = await RoleModel.findAll();
  return {
    success: true,
    data: roles.map(role => role.get({plain: true}))
  };
};

module.exports.getById = async (id) => {
  const RoleModel = db[modelName.role];
  const role = await RoleModel.findByPk(id);

  if (!role) {
    throw new Error('Role not found');
  }

  return {
    success: true,
    data: role.get({ plain: true })
  };
};