const { DataTypes } = require("sequelize");

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.STRING(25),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: "UAH"
        },
        balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    },
    options: {}
};