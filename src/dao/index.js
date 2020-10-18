const Sequelize = require('sequelize');
const path = require('path');

const config = require('../configStorage');
const modelsFactory = require('./modelsFactory');

const ROOT_DIR = '../../';
let instance = null;

const buildAssociations = () => {
    const Category = modelsFactory.get('category');
    const Record = modelsFactory.get('record');

    Category.hasMany(Record, {
        foreignKey: 'categoryId'
    });
    Record.belongsTo(Category);
};

module.exports = {
    connect: async () => {
        try {
            instance = new Sequelize('database', 'root', null, {
                dialect: 'sqlite',
                storage: path.join(__dirname, ROOT_DIR, config.DATABASE_PATH),
                logging: false
            });
            await instance.authenticate();
            console.log('SQLite connection has been established successfully!');
        } catch (err) {
            console.error(`Unable to connect to SQLite: ${err}`);
            throw err;
        }

        try {
            const CategoryModel = require(`./${config.DATABASE_IMPL}/models/Category`);
            const RecordModel = require(`./${config.DATABASE_IMPL}/models/Record`);
            const RecordStatisticsModel = require(`./${config.DATABASE_IMPL}/models/RecordStatistics`);
            const ConfigurationModel = require(`./${config.DATABASE_IMPL}/models/Configuration`);
            const CityModel = require(`./${config.DATABASE_IMPL}/models/City`);
            modelsFactory.set(instance, 'category', CategoryModel.fields, CategoryModel.options);
            modelsFactory.set(instance, 'record', RecordModel.fields, RecordModel.options);
            modelsFactory.set(instance, 'recordStatistics', RecordStatisticsModel.fields, RecordStatisticsModel.options);
            modelsFactory.set(instance, 'configuration', ConfigurationModel.fields, ConfigurationModel.options);
            modelsFactory.set(instance, 'city', CityModel.fields, CityModel.options);

            buildAssociations();

            await instance.sync();
        } catch (err) {
            console.error(`An error occurred during defining models: ${err}`);
            throw err;
        }
    },

    getDao: daoName => {
        return require(`./${config.DATABASE_IMPL}/${daoName}`);
    },

    getInstance: () => instance
};