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
        recordDate: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        isIncome: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transferRecordId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    options: {
        hooks: {
            afterCreate: record => {
                return record.reload();
            }
        }
    }
};