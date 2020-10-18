const modelsFactory = require('../modelsFactory');

let Configuration = null;

const prepareModel = asyncFunc => {
    return async function () {
        Configuration = Configuration || (Configuration = modelsFactory.get('configuration'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return Configuration.findAll({ raw: true });
});

module.exports.create = prepareModel(async (configuration) => {
    return Configuration.create(configuration);
});

module.exports.update = prepareModel(async (id, diff) => {
    return Configuration.update(diff, {
        where: { id },
        raw: true
    });
});