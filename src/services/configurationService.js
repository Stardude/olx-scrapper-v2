const configurationDao = require('../dao').getDao('configurationDao');
const updateUtil = require('../utils/updateUtil');

module.exports.get = async () => {
    return (await configurationDao.getAll())[0];
};

module.exports.createDefault = async () => {
    return configurationDao.create({});
};

module.exports.update = async data => {
    const original = await module.exports.get();
    const diff = updateUtil.computeDiff(original, data);
    await configurationDao.update(data.id, diff);
    return module.exports.get();
};
