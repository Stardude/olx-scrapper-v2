const fs = require('fs');
const path = require('path');
const { COOKIES_PATH } = require('../configStorage');
const ROOT_DIR = '../../';

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

module.exports.removeCookies = async () => {
    try {
        fs.unlinkSync(path.join(__dirname, ROOT_DIR, COOKIES_PATH));
    } catch (err) {}
};
