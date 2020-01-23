const config = require('config');
const { getValue } = require('../utils');

const { editAdvLink, pagination, statistics, message } = config.Selectors;
const { host, mainPath } = config.Urls;
const { priceChange, saveBtnClick, closePage, keyboardType } = config.Delays;

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

const prepareResult = (result, advIdsOnPage, advStatistics) => {
    advIdsOnPage.forEach((advId, index) => {
        if (!result[advId]) {
            result[advId] = {
                views: advStatistics[0][index],
                phones: advStatistics[1][index],
                chosen: advStatistics[2][index],
                message: advStatistics[3][index]
            };
        }
    });
};

module.exports = {
    fetch: async (browser) => {
        try {
            const result = {};
            let pageUrl = host + mainPath + '/active?page=1';
            const page = await browser.newPage();
            await page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
            let paginationHandlers = await page.$$(pagination);
            for (let i = 2; i <= paginationHandlers.length; i++) {
                let advIdsOnPage = await getAdvIds(page);
                let advStatistics = [
                    await getAdvStatistics(page, `${statistics} > td:nth-child(2) > div > span > span`),
                    await getAdvStatistics(page, `${statistics} > td:nth-child(3) > div > span`),
                    await getAdvStatistics(page, `${statistics} > td:nth-child(4) > div > span`),
                    await getAdvStatistics(page, message)
                ];
                prepareResult(result, advIdsOnPage, advStatistics);

                pageUrl = host + mainPath + `/active?page=${i}`;
                await page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
            }

            pageUrl = host + mainPath + '/archive?page=1';
            await page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
            paginationHandlers = await page.$$(pagination);
            for (let i = 2; i <= paginationHandlers.length; i++) {
                let advIdsOnPage = await getAdvIds(page);
                let advStatistics = [
                    await getAdvStatistics(page, `${statistics} > td:nth-child(2) > div > span > span`),
                    await getAdvStatistics(page, `${statistics} > td:nth-child(3) > div > span`),
                    await getAdvStatistics(page, `${statistics} > td:nth-child(4) > div > span`),
                    await getAdvStatistics(page, message)
                ];
                prepareResult(result, advIdsOnPage, advStatistics);

                pageUrl = host + mainPath + `/archive?page=${i}`;
                await page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
            }
            console.log('Statistics for all active products fetched!');
            return result;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
};