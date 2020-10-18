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
        views: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        phones: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        chosens: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        messages: {
            type: DataTypes.INTEGER,
            allowNull: true
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