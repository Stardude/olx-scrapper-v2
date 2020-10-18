const models = [];

module.exports.set = (sequelizeInstance, modelName, modelSchema, options) => {
    const Model = sequelizeInstance.define(modelName, modelSchema, { ...options, timestamps: true });
    models.push({ modelName, Model });
};

module.exports.get = modelName => {
    const found = models.find(model => model.modelName === modelName);
    if (!found) {
        throw new Error(`Model '${modelName}' doesn't set`);
    }
    return found.Model;
};