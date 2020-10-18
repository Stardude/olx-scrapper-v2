const modelsFactory = require('../modelsFactory');

let Category = null;
const prepareModel = asyncFunc => {
    return async function () {
        Category = Category || (Category = modelsFactory.get('category'));
        return asyncFunc(...arguments);
    };
};

module.exports.getAll = prepareModel(async () => {
    return Category.findAndCountAll({ raw: true });
});

module.exports.getOneByName = prepareModel(async name => {
    return Category.findOne({
        where: { name },
        raw: true
    });
});

module.exports.getOneById = prepareModel(async id => {
    return Category.findByPk(id, {
        raw: true
    });
});

module.exports.getMultipleByIds = prepareModel(async ids => {
    return Category.findAll({
        where: {
            id: ids
        },
        raw: true
    });
});

module.exports.create = prepareModel(async category => {
    return Category.create({
        name: category.name
    }).then(entity => entity.get());
});

module.exports.update = prepareModel(async (id, diff) => {
    return Category.update(diff, {
        where: { id },
        raw: true
    });
});

module.exports.deleteById = prepareModel(async id => {
    return Category.destroy({
        where: { id },
        raw: true
    });
});