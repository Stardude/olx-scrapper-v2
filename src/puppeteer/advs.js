const config = require('config');
const constants = require('../constants');
const fileService = require('../fileService');
const { getValue } = require('../utils');

const { priceInput, confirmWindow, page404 } = constants.SELECTORS;
const { host, editAdvPath } = constants.URLs;
const { priceChange, saveBtnClick, closePage, keyboardType } = constants.DELAYS;

const getAdvsEditUrls = async (advs) => {
    const advsUrls = [];
    for (let i = 0, j = 0; i < advs.length; i++) {
        const id = advs[i].id;
        advsUrls.push((host + editAdvPath).replace('<CODE>', id));
        if (++j === config.advsAmountPerIteration) {
            break;
        }
    }
    return advsUrls;
};

const changeFixed = (value, old) => (old + value);
const changePercentage = (value, old) => Math.round(old + (old * value / 100));

const runPromises = async (browser, advsUrls, data) => {
    let promisesAdvs = [];
    let problematicAdvs = [];
    let successfulAdvs = [];
    for (let i = 0; i < advsUrls.length; i++) {
        const advUrl = advsUrls[i];
        const advId = advUrl.match(/\d{9}/g)[0];
        promisesAdvs.push((async () => {
            let page;
            try {
                page = await browser.newPage();
                await page.goto(advUrl, {waitUntil: 'load', timeout: 0});
                try {
                    await page.waitForSelector(page404, {timeout: 5000});
                    throw new Error('Page not found');
                } catch (err) {
                    if (err.message === 'Page not found') {
                        throw err;
                    }
                }

                try {
                    await page.waitForSelector(priceInput);
                } catch (err) {
                    throw err;
                }

                if (config.onlyActive && await page.$('#choose-category-button') !== null) {
                    await page.waitFor(closePage);
                    throw new Error('Adv ' + advId + ' is not active');
                }

                const elHandle = await page.$(priceInput);
                const oldValue = (await getValue(elHandle, 'value')).replace(' ', '').replace(',', '.');;
                const value = data.value.replace(' ', '').replace(',', '.');

                const newValue = data.type === 'fixed' ?
                    changeFixed(parseFloat(value), parseFloat(oldValue)) :
                    changePercentage(parseFloat(value), parseFloat(oldValue));

                await page.waitFor(priceChange);
                await page.evaluate('window.scrollBy(0, 100)');
                await page.click(priceInput, { clickCount: 2 });
                await page.keyboard.down('Control');
                await page.keyboard.press('A');
                await page.keyboard.up('Control');
                await page.waitFor(100);
                await page.keyboard.press('Backspace');
                await page.waitFor(100);
                await page.keyboard.type(new String(newValue), { delay: keyboardType });

                await page.waitFor(saveBtnClick);
                await page.click('#save');
                await page.waitForSelector(confirmWindow);
                await page.close();
                successfulAdvs.push(advId);
                console.log(`Product ${advId} processed!`);
            } catch (err) {
                fileService.log(`Problem in ${advId}: ${err}`);
                console.error(`Product ${advId} failed!`);
                await page.close();
                problematicAdvs.push(advId);
            }
        })());
    }

    try {
        await Promise.all(promisesAdvs);
    } catch (e) {}

    return { successfulAdvs, problematicAdvs };
};

const editAll = async (browser, data) => {
    const advsUrls = await getAdvsEditUrls(data.advs);
    const { successfulAdvs, problematicAdvs } = await runPromises(browser, advsUrls, data);
    return { successfulAdvs, problematicAdvs, offset: advsUrls.length || null };
};

module.exports = { editAll };