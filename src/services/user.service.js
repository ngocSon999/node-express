const { db, connection } = require('../utils/initializeDb');
const { modelName } = require('../constants/modelName');
const { Sequelize, Op, fn, col, literal, where } = require('sequelize');
const bcrypt = require('bcrypt');
const moment = require('moment');


module.exports.getAllUsers = async (req) => {
    return await this.getUserByType(req, []);
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
  const { name, email, phone, password } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const code = `USR-${Date.now().toString().slice(-9)}`;
  const UserModel = db[modelName.user];
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email,
    code,
    phone,
    avatar,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return {
    success: true,
    message: 'User created successfully!',
    data: user.get({ plain: true })
  };
};

module.exports.update = async (req) => {
  const { name, email, phone, password } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const code = `USR-${Date.now().toString().slice(-9)}`;
  const UserModel = db[modelName.user];
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email,
    code,
    phone,
    avatar,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return {
    success: true,
    message: 'User updates successfully!',
    data: user.get({ plain: true })
  };
};

