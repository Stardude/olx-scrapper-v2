const { DataTypes } = require('sequelize');

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        olxId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lastPriceChange: {
            type: DataTypes.STRING(24),
            allowNull: true
        },
        lastPriceStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
    options: {}
};