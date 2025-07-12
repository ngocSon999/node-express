const { db, connection } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');
const { Sequelize, Op, fn, col, literal, where } = require('sequelize');
const bcrypt = require('bcrypt');
const moment = require('moment');


module.exports.getAllUsers = async (req) => {
    const UserModel = db[modelName.user];
    const RoleModel = db[modelName.role];

    const users = await UserModel.findAll({
        include: [{
            model: RoleModel,
            through: { attributes: [] }
        }],
        order: [['createdAt', 'DESC']]
    });

    return users.map(user => user.get({ plain: true }));
};

module.exports.getDetail = async (id) => {
  const UserModel = db[modelName.user];
  const user = await UserModel.findByPk(id, { raw: true }); // raw: true để trả plain object
  return user;
};

module.exports.findByPk = async (id) => {
  const UserModel = db[modelName.user];
  const user = await UserModel.findByPk(id, { raw: true }); 
  return user;
};

module.exports.destroy = async (id) => {
  const UserModel = db[modelName.user];
    await UserModel.destroy({
      where: { id: parseInt(id, 10) }
    });
};

module.exports.getUserByType = async (req, typeUsers = [typeUser.INSTALLER], filterBySite = false, jobSiteDetails = {}) => {
    let query = `
        SELECT *
        FROM ${modelName.user}
    `;

    const [result] = await connection.query({
        query: query,
        values: [...typeUsers],
    });

    return result;
};

module.exports.create = async (req) => {
  const { name, email, phone, password, roles } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const code = `USR-${Date.now().toString().slice(-9)}`;
  const UserModel = db[modelName.user];
  const UserRoleModel = db[modelName.user_role];
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await connection.transaction(async (t) => {
    // Create user
    const user = await UserModel.create({
      name,
      email,
      code,
      phone,
      avatar,
      password: hashedPassword,
      createdAt: new Date(),
    }, { transaction: t });

    // Assign roles if provided
    if (roles && roles.length > 0) {
      const userRoles = roles.map(roleId => ({
        user_id: user.id,
        role_id: roleId
      }));
      await UserRoleModel.bulkCreate(userRoles, { transaction: t });
    }

    return user;
  });

  return {
    success: true,
    message: 'User created successfully!',
    data: result.get({ plain: true })
  };
};

module.exports.getUserWithRoles = async (id) => {
  const UserModel = db[modelName.user];
  const RoleModel = db[modelName.role];

  const user = await UserModel.findByPk(id, {
    include: [{
      model: RoleModel,
      through: { attributes: [] } // Exclude junction table attributes
    }]
  });

  return user ? user.get({ plain: true }) : null;
};

module.exports.update = async (req) => {
  const { id } = req.params;
  const { name, email, phone, password, roles } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const UserModel = db[modelName.user];
  const UserRoleModel = db[modelName.user_role];

  const result = await connection.transaction(async (t) => {
    // Update user
    const updateData = {
      name,
      email,
      phone,
      updatedAt: new Date()
    };

    if (avatar) {
      updateData.avatar = avatar;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.findByPk(id);
    await user.update(updateData, { transaction: t });

    // Update roles if provided
    if (roles) {
      // Remove existing roles
      await UserRoleModel.destroy({
        where: { user_id: id },
        transaction: t
      });

      // Add new roles
      if (roles.length > 0) {
        const userRoles = roles.map(roleId => ({
          user_id: id,
          role_id: roleId
        }));
        await UserRoleModel.bulkCreate(userRoles, { transaction: t });
      }
    }

    return user;
  });

  return {
    success: true,
    message: 'User updated successfully!',
    data: result.get({ plain: true })
  };
};

