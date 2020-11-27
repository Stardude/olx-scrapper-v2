const modelsFactory = require("../modelsFactory");
const sequelize = require("sequelize");

let RecordStatistics = null;

const prepareModel = asyncFunc => {
    return async function () {
        RecordStatistics = RecordStatistics || (RecordStatistics = modelsFactory.get("recordStatistics"));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return RecordStatistics.findAndCountAll({ raw: true });
});

module.exports.countByCityId = prepareModel(async () => {
    return RecordStatistics.findAll({
        group: ["cityId", "isTop"],
        attributes: ["cityId", "isTop", [sequelize.fn("COUNT", "cityId"), "count"]],
        raw: true
    });
});

module.exports.createMany = prepareModel(async (statistics, options = {}) => {
    return RecordStatistics.bulkCreate(statistics, options);
});