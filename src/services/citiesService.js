const config = require('../configStorage');
const cityDao = require('../dao').getDao('cityDao');
const puppeterService = require('./puppeter');
const googleService = require('./google');
const pageService = require('./pageService');
const statisticsService = require('./statisticsService');
const updateUtil = require('../utils/updateUtil');
const logger = require('../utils/logger')('CITIES_SERVICE');
const { getDataFacetsAttribute } = require('../utils/puppeterUtils');

const constants = require('./puppeter/constants');
const { host, categoryPath, cityTopQuery } = constants.URLs;
const { cityAmount } = constants.SELECTORS;

module.exports.insertManyIfNotExist = async (cities) => {
    return cityDao.createMany(cities.map(cityCode => ({ olxId: cityCode, name: cityCode })), { ignoreDuplicates: true });
};

module.exports.create = async newCity => {
    return cityDao.create(newCity);
};

module.exports.updateAmountMany = async (cities) => {
    return cityDao.createMany(cities, { updateOnDuplicate: ['generalAmount', 'topAmount', 'dateOfChecking'] });
};

module.exports.getAll = async () => {
    const { count, rows } = await cityDao.getAll();
    const stats = await statisticsService.countByCityId();
    const cities = rows.map(row => {
        const stat = stats.find(stat => stat.cityId === row.olxId);
        return {
            ...row,
            myGeneralAmount: stat ? stat.count : null,
            myTopAmount: stat ? stat.count : null
        };
    });
    return { count, cities };
};

module.exports.getOneById = async (id) => {
    const city = await cityDao.getOneById(id);
    return city || null;
};

module.exports.getMultipleByIds = async (ids) => {
    return cityDao.getMultipleByIds(ids);
};

module.exports.getOneByOlxId = async (olxId) => {
    const city = await cityDao.getOneByOlxId(olxId);
    return city || null;
};

module.exports.update = async (id, updated) => {
    const original = await cityDao.getOneById(id);
    const diff = updateUtil.computeDiff(original, updated);
    await cityDao.update(id, diff);
    return cityDao.getOneById(id);
};

module.exports.delete = async id => {
    return cityDao.deleteById(id);
};

const prepareUrls = (cities) => {
    const generalUrls = [];
    const topUrls = [];
    for (let i = 0; i < cities.length; i++) {
        generalUrls.push({
            data: cities[i],
            url: `${host}${categoryPath}/${cities[i].olxId}`
        });
        topUrls.push({
            data: cities[i],
            url: `${host}${categoryPath}/${cities[i].olxId}/${cityTopQuery}`
        });
    }
    return { generalUrls, topUrls };
};

const handleCityPage = async (page, urlData) => {
    const { data: city  } = urlData;
    try {
        logger.info(`Processing city '${city.olxId}'...`);
        await page.waitForSelector(cityAmount);
        const elHandle = await page.$(cityAmount);
        const dataFacets = await getDataFacetsAttribute(page, elHandle);
        logger.info(`City '${city.olxId}' statistics fetched!`);
        return {
            city,
            amount: JSON.parse(dataFacets)["offer_seek"]["offer"]
        };
    } catch (err) {
        logger.error(`An error occurred during fetching city '${city.olxId}' statistics: ${err}`);
        throw err;
    }
};

const storeInDatabase = async (list) => {
    try {
        await module.exports.updateAmountMany(list);
    } catch (err) {
        logger.error(`An error occurred while saving cities statistics to DB: ${err}`);
    }
};

module.exports.getStatistics = async ({ cities, writeToExcel, getFromDb }) => {
    let result = [];

    if (!getFromDb) {
        const { generalUrls, topUrls } = prepareUrls(cities);
        const browser = await puppeterService.launchAndLogin();

        const { successes: generalData, errors: generalErrors } = await pageService.loopThroughPages(browser, generalUrls, handleCityPage, {
            pagesPerIteration: config.CITIES_PER_ITERATION
        });

        const { successes: topData, errors: topErrors } = await pageService.loopThroughPages(browser, topUrls, handleCityPage, {
            pagesPerIteration: config.CITIES_PER_ITERATION
        });

        if (generalErrors.length) {
            for (let i = 0; i < generalErrors.length; i++) {
                const { data: city, reason: err } = errors[i];
                logger.error(`An error occurred during fetching general statistics from city '${city.olxId}': ${err}`);
            }
        }

        if (topErrors.length) {
            for (let i = 0; i < topErrors.length; i++) {
                const { data: city, reason: err } = errors[i];
                logger.error(`An error occurred during fetching top statistics from city '${city.olxId}': ${err}`);
            }
        }

        logger.info(`Statistics for all cities fetched! Total amount: ${Object.keys(generalData).length}`);
        await puppeterService.close();

        const stats = await statisticsService.countByCityId();
        const NOW = new Date().toISOString();
        result = generalData.map(g => {
            const t = topData.find(t => t.city.olxId === g.city.olxId);
            const stat = stats.find(stat => stat.cityId === g.city.olxId);
            return {
                olxId: g.city.olxId,
                name: g.city.name,
                generalAmount: g.amount,
                topAmount: t.amount,
                myGeneralAmount: stat ? stat.count : null,
                myTopAmount: stat ? stat.count : null,
                dateOfChecking: NOW
            };
        });
        await storeInDatabase(result);
    } else {
        const stats = await statisticsService.countByCityId();
        result = cities.map(city => {
            const stat = stats.find(stat => stat.cityId === city.olxId);
            return {
                olxId: city.olxId,
                name: city.name,
                generalAmount: city.generalAmount,
                topAmount: city.topAmount,
                myGeneralAmount: stat ? stat.count : null,
                myTopAmount: stat ? stat.count : null,
                dateOfChecking: city.dateOfChecking
            };
        });
    }

    if (writeToExcel) {
        await googleService.writeCitiesToSpreadsheet(result);
    }

    return module.exports.getAll();
};