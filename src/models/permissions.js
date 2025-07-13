const { DataTypes } = require('sequelize');
const { modelName } = require('../constants/modelName');
const slugify = require('slugify');

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
        slug: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
    };

    const permission = connection.define(modelName.permission, attributes, {
        timestamps: true,
        tableName: modelName.permission,
        hooks: {
            beforeCreate: (permission) => {
                permission.slug = slugify(permission.name, { lower: true, strict: true });
            },
            beforeUpdate: (permission) => {
                permission.slug = slugify(permission.name, { lower: true, strict: true });
            }
        }
    });

    permission.associate = (models) => {
        permission.belongsToMany(models[modelName.role], {
            through: models[modelName.role_permission],
            foreignKey: 'permission_id',
            otherKey: 'role_id',
        });
    };

    return permission;
};
