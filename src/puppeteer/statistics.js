const constants = require('../constants');
const { getValue, getDataFeaturesAttribute } = require('../utils');

const { editAdvLink, pagination, views, phones, chosen, message, city } = constants.SELECTORS;
const { host, mainPath } = constants.URLs;

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

const prepareResult = (result, advIdsOnPage, advStatistics) => {
    advIdsOnPage.forEach((advId, index) => {
        if (!result[advId]) {
            result[advId] = {
                views: advStatistics[0][index],
                phones: advStatistics[1][index],
                chosen: advStatistics[2][index],
                message: advStatistics[3][index].trim(),
                city: advStatistics[4][index]
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
            await getCity(page, city)
        ];
        prepareResult(acc, advIdsOnPage, advStatistics);

        pageNumber++;
    } while (pageNumber <= paginationHandlers.length);
};

module.exports = {
    fetch: async (browser) => {
        try {
            const result = {};
            const page = await browser.newPage();

            await fetchByAdvType(result, page, 'active');
            await fetchByAdvType(result, page, 'archive');

            console.log(`Statistics for all products fetched! Total amount: ${Object.keys(result).length}`);
            return result;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
};