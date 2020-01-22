const fs = require('fs').promises;
const categories = require('config').Categories;
const categoriesPath = `${__dirname}/../config/categories`;

const log = async message => {
    await fs.appendFile(`${__dirname}/../logs/log.txt`, `${new Date()}; ${message}\n`);
};

const getListOfAdvs = async () => {
    const result = {};
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const buffer = await fs.readFile(`${categoriesPath}/${category}.json`);
        const listStr = buffer.toString();
        if (listStr !== '') {
            result[category] = JSON.parse(listStr);
        }
    }
    return result;
};

const getListOfAdvsByCategory = async category => {
    const buffer = await fs.readFile(`${categoriesPath}/${category}.json`);
    const listStr = buffer.toString();
    return (listStr !== '') ? JSON.parse(listStr) : null;
};

const updateCategoryList = async (category, list) => {
    const newList = list.map(l => ({id: l.id, name: l.name}));
    await fs.writeFile(`${categoriesPath}/${category}.json`, JSON.stringify(newList, null, 2));
    return await getListOfAdvsByCategory(category);
};

module.exports = { getListOfAdvs, getListOfAdvsByCategory, updateCategoryList, log };