const recordStatisticsDao = require('../recordStatisticsDao');
const categoryDao = require('../categoryDao');
const recordDao = require('../recordDao');

module.exports = async () => {
    const category = await categoryDao.getOneByName('ALL');
    if (category) {
        return;
    }

    const { id: categoryId } = await categoryDao.create({ name: 'ALL' });

    const { rows: statistics } = await recordStatisticsDao.getAll();
    for (let i = 0; i < statistics.length; i++) {
        const statistic = statistics[i];
        await recordDao.create({
            olxId: statistic.olxId,
            name: statistic.olxId,
            categoryId
        });
    }
};