const recordStatisticsDao = require('../dao').getDao('recordStatisticsDao');

const puppeterService = require('./puppeter');
const citiesService = require('./citiesService');
const configurationService = require('./configurationService');
const googleService = require('./google');
const logger = require('../utils/logger')('STATISTICS_SERVICE');

const constants = require('./puppeter/constants');
const { getValue, getDataFeaturesAttribute } = require('../utils/puppeterUtils');

const { editAdvLink, pagination, views, phones, chosen, message, city, isTop, isTopInner } = constants.SELECTORS;
const { host, mainPath } = constants.URLs;

module.exports.get = async () => {
    const { count, rows } = await recordStatisticsDao.getAll();
    return { count, statistics: rows };
};

module.exports.countByCityId = async () => {
    return recordStatisticsDao.countByCityId();
};

const getAdvIds = async page => {
    const editLinks = await page.$$(editAdvLink);
    const advIds = [];
    for (let i = 0; i < editLinks.length; i++) {
        advIds.push((await getValue(editLinks[i], 'id')).slice(4));
    }

    return advIds;
};

const getAdvStatistics = async (page, statSelector) => {
    const statsRows = await page.$$(statSelector);
    const statisticData = [];
    for (let i = 0; i < statsRows.length; i++) {
        const statsRow = statsRows[i];
        statisticData.push(await getValue(statsRow, 'innerText'));
    }

    return statisticData;
};

const getCity = async (page, citySelector) => {
    const citiesRows = await page.$$(citySelector);
    const citiesData = [];
    for (let i = 0; i < citiesRows.length; i++) {
        const citiesRow = citiesRows[i];
        const dataFeatures = await getDataFeaturesAttribute(page, citiesRow);

        try {
            const parsedData = JSON.parse(dataFeatures)["city_name"];
            citiesData.push(parsedData);
        } catch (err) {
            citiesData.push(null);
        }
    }

    return citiesData;
};

const getTop = async (page, selector) => {
    const topRows = await page.$$(selector);
    const topData = [];
    for (let i = 0; i < topRows.length; i++) {
        const topRow = topRows[i];
        const topHandle = await topRow.$(isTopInner);
        topData.push(!!topHandle);
    }

    return topData;
};

const prepareResult = (result, advIdsOnPage, advStatistics, advType) => {
    advIdsOnPage.forEach((advId, index) => {
        if (!result[advId]) {
            result[advId] = {
                views: advStatistics[0][index],
                phones: advStatistics[1][index],
                chosens: advStatistics[2][index],
                messages: advStatistics[3][index].trim(),
                cityId: advStatistics[4][index],
                isActive: advType === 'active',
                isTop: advStatistics[5][index]
            };
        }
    });
};

const fetchByAdvType = async (acc, page, advType) => {
    let paginationHandlers = [];
    let pageNumber = 1;
    let pageUrl = null;

    do {
        pageUrl = host + mainPath + `/${advType}?page=${pageNumber}`;
        await page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
        if (paginationHandlers.length === 0) {
            paginationHandlers = await page.$$(pagination);
        }

        let advIdsOnPage = await getAdvIds(page);
        let advStatistics = [
            await getAdvStatistics(page, views),
            await getAdvStatistics(page, phones),
            await getAdvStatistics(page, chosen),
            await getAdvStatistics(page, message),
            await getCity(page, city),
            await getTop(page, isTop)
        ];
        prepareResult(acc, advIdsOnPage, advStatistics, advType);

        pageNumber++;
    } while (pageNumber <= paginationHandlers.length);
};

const storeInDatabase = async data => {
    const NOW = new Date().toISOString();
    const olxIds = Object.keys(data);

    try {
        const cities = olxIds
            .map(olxId => data[olxId].cityId)
            .filter(city => !!city)
            .filter((value, index, self) => self.indexOf(value) === index);
        await citiesService.insertManyIfNotExist(cities);
    } catch (err) {
        logger.error(`An error occurred while saving cities to DB: ${err}`);
    }

    const { rows: oldStatistics } = await recordStatisticsDao.getAll();
    try {
        const statistics = olxIds.map(olxId => {
            const oldStatistic = oldStatistics.find(old => `${old.olxId}` === `${olxId}`) || {};
            return {
                olxId,
                views: data[olxId].views,
                lastViews: oldStatistic.views || 0,
                phones: data[olxId].phones,
                lastPhones: oldStatistic.phones || 0,
                chosens: data[olxId].chosens,
                lastChosens: oldStatistic.chosens || 0,
                messages: data[olxId].messages,
                lastMessages: oldStatistic.messages || 0,
                cityId: data[olxId].cityId,
                isActive: data[olxId].isActive,
                dateOfChecking: NOW,
                isTop: data[olxId].isTop
            };
        });
        await recordStatisticsDao.createMany(statistics, {
            updateOnDuplicate: [
                'views',
                'lastViews',
                'phones',
                'lastPhones',
                'chosens',
                'lastChosens',
                'messages',
                'lastMessages',
                'cityId',
                'isActive',
                'dateOfChecking',
                'isTop'
            ]
        });
    } catch (err) {
        logger.error(`An error occurred while saving statistics to DB: ${err}`);
    }
};

const applyCityNames = async data => {
    const olxIds = Object.keys(data);
    const { cities } = await citiesService.getAll();

    olxIds.forEach(olxId => {
        if (!!data[olxId].cityId) {
            const city = cities.find(city => city.olxId === data[olxId].cityId);
            data[olxId].cityName = !!city.name ? city.name : city.olxId;
        }
    });
};

const prepareResultFromDb = (result, statistics) => {
    statistics.forEach(stat => {
        if (!result[stat.olxId]) {
            result[stat.olxId] = {
                views: stat.views,
                phones: stat.phones,
                chosens: stat.chosens,
                messages: stat.messages,
                cityId: stat.cityId,
                isActive: stat.isActive
            };
        }
    });
};

module.exports.collect = async ({ writeToExcel, getFromDb }) => {
    const { statisticsOnlyActive } = await configurationService.get();
    const result = {};

    if (!getFromDb) {
        const browser = await puppeterService.launchAndLogin();
        const page = await browser.newPage();

        await fetchByAdvType(result, page, 'active');
        if (!statisticsOnlyActive) {
            await fetchByAdvType(result, page, 'archive');
        }

        logger.info(`Statistics for all products fetched! Total amount: ${Object.keys(result).length}`);
        await puppeterService.close();

        await storeInDatabase(result);
    } else {
        const { statistics } = await module.exports.get();
        prepareResultFromDb(result, statistics);
    }

    if (writeToExcel) {
        await applyCityNames(result);
        await googleService.writeStatisticToSpreadsheet(result);
    }

    return result;
};