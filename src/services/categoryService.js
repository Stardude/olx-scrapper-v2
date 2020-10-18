const categoryDao = require('../dao').getDao('categoryDao');

const updateUtil = require('../utils/updateUtil');

module.exports.create = async newCategory => {
    return categoryDao.create(newCategory);
};

module.exports.getAll = async () => {
    const { count, rows } = await categoryDao.getAll();
    return { count: count, categories: rows };
};

module.exports.getOneByName = async name => {
    const category = await categoryDao.getOneByName(name);
    return category || null;
};

module.exports.getOneById = async id => {
    const category = await categoryDao.getOneById(id);
    return category || null;
};

module.exports.update = async (id, updated) => {
    const original = await categoryDao.getOneById(id);
    const diff = updateUtil.computeDiff(original, updated);
    await categoryDao.update(id, diff);
    return categoryDao.getOneById(id);
};

module.exports.delete = async id => {
    return categoryDao.deleteById(id);
};
