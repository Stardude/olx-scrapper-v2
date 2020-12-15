const configurationDao = require('../configurationDao');

module.exports = async () => {
    const configuration = (await configurationDao.getAll())[0];
    if (!configuration) {
        await configurationDao.create({});
    }
};