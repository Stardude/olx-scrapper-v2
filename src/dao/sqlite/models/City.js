const { DataTypes } = require('sequelize');

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        olxId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        generalAmount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        topAmount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        myGeneralAmount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        myTopAmount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dateOfChecking: {
            type: DataTypes.STRING(24),
            allowNull: true
        }
    },
    options: {}
};