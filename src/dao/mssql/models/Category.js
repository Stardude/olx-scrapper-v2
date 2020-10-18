const { DataTypes } = require("sequelize");

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(25),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    },
    options: {}
};