const modelsFactory = require('../modelsFactory');

let Record = null,
    Category = null;

const prepareModel = asyncFunc => {
    return async function () {
        Record = Record || (Record = modelsFactory.get('record'));
        Category = Category || (Category = modelsFactory.get('category'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async ({categoryId}) => {
    let where = { categoryId };
    return Record.findAndCountAll({
        where,
        raw: true
    });
});

module.exports.getOneById = prepareModel(async id => {
    return Record.findByPk(id, {
        include: [
            { model: Category, required: true }
        ],
        raw: true
    });
});

module.exports.findOne = prepareModel(async whereQuery => {
    return Record.findOne({
        where: whereQuery,
        raw: true
    });
});

module.exports.create = prepareModel(async record => {
    return Record.create({
        olxId: record.olxId,
        name: record.name,
        categoryId: record.categoryId
    }, {
        raw: true
    });
});

module.exports.update = prepareModel(async (id, diff) => {
    return Record.update(diff, {
        where: { id },
        raw: true
    });
});

module.exports.deleteById = prepareModel(async id => {
    return Record.destroy({
        where: { id },
        raw: true
    });
});