const { Op } = require('sequelize');
const modelsFactory = require('../modelsFactory');

let Record = null,
    Account = null,
    Category = null;

const prepareModel = asyncFunc => {
    return async function () {
        Record = Record || (Record = modelsFactory.get('record'));
        Account = Account || (Account = modelsFactory.get('account'));
        Category = Category || (Category = modelsFactory.get('category'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async ({accountId, order, limit, offset, categoryId, recordDate}) => {
    let where = { accountId };

    if (categoryId) {
        where = { ...where, categoryId };
    }

    if (recordDate) {
        if (typeof recordDate === "object") {
            where = { ...where, recordDate: { [Op[recordDate.operator]]: recordDate.value } };
        } else {
            where = { ...where, recordDate };
        }
    }

    return Record.findAndCountAll({
        where,
        limit,
        offset,
        order,
        raw: true,
        include: [
            { model: Category, required: true, subQuery: true }
        ],
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

module.exports.create = prepareModel(async record => {
    return Record.create({
        recordDate: record.recordDate,
        accountId: record.accountId,
        categoryId: record.categoryId,
        price: record.price,
        amount: record.amount,
        comment: record.comment,
        isIncome: record.isIncome,
        transferRecordId: record.transferRecordId
    }, {
        include: [
            { model: Category, required: true }
        ]
    }).then(entity => entity.toJSON());
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