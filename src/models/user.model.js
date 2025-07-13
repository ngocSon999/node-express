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
        code: {
            type: DataTypes.STRING(14),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    };

    const user = connection.define(modelName.user, attributes, {
        timestamps: true,
        tableName: modelName.user,
        defaultScope: {
        attributes: { exclude: ['password'] } // auto hidden password
    }
    });

    user.associate = (models) => {
        user.belongsToMany(models[modelName.role], {
            through: models[modelName.user_role],
            foreignKey: 'user_id',
            otherKey: 'role_id',
        });
    };

    return user;
};
