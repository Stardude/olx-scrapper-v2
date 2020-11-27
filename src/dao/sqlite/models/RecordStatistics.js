const { DataTypes } = require("sequelize");

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        olxId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isTop: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastViews: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        phones: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastPhones: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        chosens: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastChosens: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        messages: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastMessages: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        cityId: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        dateOfChecking: {
            type: DataTypes.STRING(24),
            allowNull: true
        }
    },
    options: {}
};