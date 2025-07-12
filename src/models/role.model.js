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
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    };

    const role = connection.define(modelName.role, attributes, {
        timestamps: true,
        tableName: modelName.role,
        hooks: {
            beforeCreate: (role) => {
                role.slug = slugify(role.name, { lower: true, strict: true });
            },
            beforeUpdate: (role) => {
                role.slug = slugify(role.name, { lower: true, strict: true });
            }
        }
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
