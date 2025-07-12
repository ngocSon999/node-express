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
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'role_id']
            }
        ]
    });

    userRole.associate = (models) => {
        userRole.belongsTo(models[modelName.user], {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
        userRole.belongsTo(models[modelName.role], {
            foreignKey: 'role_id',
            onDelete: 'CASCADE'
        });
    };

    return userRole;
};
