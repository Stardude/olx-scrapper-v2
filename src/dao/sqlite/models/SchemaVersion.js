const { DataTypes } = require('sequelize');

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(75),
            allowNull: false,
            unique: true
        }
    },
    options: {}
};