const modelsFactory = require('../modelsFactory');

let SchemaVersion = null;

const prepareModel = asyncFunc => {
    return async function () {
        SchemaVersion = SchemaVersion || (SchemaVersion = modelsFactory.get('schemaVersion'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return SchemaVersion.findAll({ raw: true });
});

module.exports.create = prepareModel(async (version) => {
    return SchemaVersion.create(version);
});