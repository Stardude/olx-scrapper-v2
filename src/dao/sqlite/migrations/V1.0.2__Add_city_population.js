const City = require('../../modelsFactory').get('city')

module.exports = async () => {
    await City.sync({ alter: true });
};