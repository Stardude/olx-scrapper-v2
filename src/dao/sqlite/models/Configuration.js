const { DataTypes } = require('sequelize');

module.exports = {
    fields: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        priceChangeAdvsAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            defaultValue: 3
        },
        priceChangeOnlyActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: true,
            defaultValue: true
        },
        citiesAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            defaultValue: 4
        },
        statisticsOnlyActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: true,
            defaultValue: true
        },
        olxEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            defaultValue: "example@gmail.com"
        },
        olxPassword: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            defaultValue: "example"
        },
        googleSpreadsheetId: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true,
            defaultValue: "example"
        },
        googleRecordsSheetName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            defaultValue: "General"
        },
        googleCitiesSheetName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            defaultValue: "Cities"
        }
    },
    options: {}
};