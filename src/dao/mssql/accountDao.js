const modelsFactory = require('../modelsFactory');

let Account = null;
const prepareModel = asyncFunc => {
    return async function () {
        Account = Account || (Account = modelsFactory.get('account'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return Account.findAndCountAll({ raw: true });
});

module.exports.getOneByName = prepareModel(async name => {
    return Account.findOne({
        where: { name },
        raw: true
    });
});

module.exports.getOneById = prepareModel(async id => {
    return Account.findByPk(id, {
        raw: true
    });
});

module.exports.getMultipleByIds = prepareModel(async ids => {
    return Account.findAll({
        where: {
            id: ids
        },
        raw: true
    });
});

module.exports.create = prepareModel(async account => {
    return Account.create({
        name: account.name,
        currency: account.currency
    }).then(entity => entity.get());
});

module.exports.update = prepareModel(async (id, diff) => {
    return Account.update(diff, {
        where: { id },
        raw: true
    });
});

module.exports.deleteById = prepareModel(async id => {
    return Account.destroy({
        where: { id },
        raw: true
    });
});