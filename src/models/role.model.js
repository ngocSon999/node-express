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
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
    };

    const role = connection.define(modelName.role, attributes, {
        timestamps: true,
        tableName: modelName.role,
    });

    role.associate = (models) => {
        role.belongsToMany(models[modelName.user], {
            through: models[modelName.user_role],
            foreignKey: 'role_id',
            otherKey: 'user_id',
        });
    };

    return role;
};
