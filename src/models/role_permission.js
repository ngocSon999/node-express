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
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };

    const rolePermission = connection.define(modelName.role_permission, attributes, {
        timestamps: true,
        tableName: modelName.role_permission,
        indexes: [
            {
                unique: true,
                fields: ['permission_id', 'role_id']
            }
        ]
    });

    rolePermission.associate = (models) => {
        rolePermission.belongsTo(models[modelName.permission], {
            foreignKey: 'permission_id',
            onDelete: 'CASCADE'
        });
        rolePermission.belongsTo(models[modelName.role], {
            foreignKey: 'role_id',
            onDelete: 'CASCADE'
        });
    };

    return rolePermission;
};
