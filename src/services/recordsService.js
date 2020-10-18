const recordDao = require('../dao').getDao('recordDao');
const updateUtil = require('../utils/updateUtil');

module.exports.create = async data => {
    return recordDao.create(data);
};

module.exports.getForCategory = async (categoryId) => {
    const records = await recordDao.getAll({categoryId});
    return { count: records.count, records: records.rows };
};

module.exports.getOneById = async id => {
    const record = await recordDao.getOneById(id);
    return record || null;
};

module.exports.getOneByOlxId = async (categoryId, olxId) => {
    const record = await recordDao.findOne({ categoryId, olxId });
    return record || null;
};

module.exports.update = async (id, updated) => {
    const original = await recordDao.getOneById(id);
    const diff = updateUtil.computeDiff(original, updated);
    await recordDao.update(id, diff);
    return recordDao.getOneById(id);
};

module.exports.delete = async id => {
    return recordDao.deleteById(id);
};