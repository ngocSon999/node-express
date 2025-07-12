const { DataTypes } = require('sequelize');
const { modelName } = require('../constants/modelName');
module.exports = (connection) => {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };

    const userRole = connection.define(modelName.user_role, attributes, {
        timestamps: true,
        tableName: modelName.user_role,
    });

    return userRole;
};
