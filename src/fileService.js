const fs = require('fs');
const categories = require('config').Categories;
const categoriesPath = `${__dirname}/../config/categories`;

const _checkAndCreateFilePath = (directoryPath, filePath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
};

const log = message => {
    const directoryPath = `${__dirname}/../logs`;
    const filePath = `${directoryPath}/log.txt`;
    const formattedMessage = `${new Date()}; ${message}\n`;
    _checkAndCreateFilePath(directoryPath, filePath);

    fs.appendFileSync(filePath, formattedMessage);
};

const getListOfAdvs = () => {
    const result = {};
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const buffer = fs.readFileSync(`${categoriesPath}/${category}.json`);
        const listStr = buffer.toString();
        if (listStr !== '') {
            result[category] = JSON.parse(listStr);
        }
    }
    return result;
};

const getListOfAdvsByCategory = category => {
    const buffer = fs.readFileSync(`${categoriesPath}/${category}.json`);
    const listStr = buffer.toString();
    return (listStr !== '') ? JSON.parse(listStr) : null;
};

const updateCategoryList = (category, list) => {
    const newList = list.map(l => ({id: l.id, name: l.name}));
    fs.writeFileSync(`${categoriesPath}/${category}.json`, JSON.stringify(newList, null, 2));
    return getListOfAdvsByCategory(category);
};

module.exports = { getListOfAdvs, getListOfAdvsByCategory, updateCategoryList, log };