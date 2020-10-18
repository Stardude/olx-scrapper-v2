const modelsFactory = require('../modelsFactory');

let City = null;

const prepareModel = asyncFunc => {
    return async function () {
        City = City || (City = modelsFactory.get('city'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return City.findAndCountAll({ raw: true });
});

module.exports.getOneByOlxId = prepareModel(async olxId => {
    return City.findOne({
        where: { olxId },
        raw: true
    });
});

module.exports.getOneById = prepareModel(async id => {
    return City.findByPk(id, {
        raw: true
    });
});

module.exports.getMultipleByIds = prepareModel(async ids => {
    return City.findAll({
        where: {
            id: ids
        },
        raw: true
    });
});

module.exports.create = prepareModel(async city => {
    return City.create({
        olxId: city.olxId,
        name: city.name
    }).then(entity => entity.get());
});

module.exports.update = prepareModel(async (id, diff) => {
    return City.update(diff, {
        where: { id },
        raw: true
    });
});

module.exports.deleteById = prepareModel(async id => {
    return City.destroy({
        where: { id },
        raw: true
    });
});

module.exports.createMany = prepareModel(async (cities, options = {}) => {
    return City.bulkCreate(cities, options);
});