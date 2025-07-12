const {Sequelize}  = require('sequelize');
const sequelizeConfig = require('../config/sequelize.config');
const fs = require('fs');
const path = require('path');
const pathModel = path.join(__dirname, '../models');
const db = {};
let connection = null;

const initialize = async () => {
    try {
        connection = new Sequelize(sequelizeConfig);

        fs.readdirSync(pathModel).filter((file) => (file.split('.').pop() === 'js' && file !== 'index.js')).map((file) => {
            const model = require(`${pathModel}/${file}`)(connection);
            db[model.name] = model;
            return model;
        });

        Object.keys(db).forEach((modelName) => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        if (process.env.SYNC_DATABASE_MODELS === 'on') {
            await connection.sync({ alter: true });
        }
        console.log('connection===>', 'start conection success')
    } catch (error) {
        console.error(error);
    }
};
initialize();

module.exports = {
  initialize,
  db,
  connection,
};
