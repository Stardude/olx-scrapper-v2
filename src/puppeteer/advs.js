const config = require('config');
const fileService = require('../fileService');
const { getValue } = require('../utils');

const { priceInput, saveAdvBtn, confirmWindow } = config.Selectors;
const { host, editAdvPath } = config.Urls;
const { priceChange, saveBtnClick, closePage, keyboardType } = config.Delays;

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
        promisesAdvs.push(new Promise(async (resolve, reject) => {
            let page;
            try {
                page = await browser.newPage();
                await page.goto(advUrl, {waitUntil: 'load', timeout: 0});
                try {
                    await page.waitForSelector(priceInput);
                } catch (err) {
                    return reject(err);
                }

                if (config.onlyActive && await page.$('#choose-category-button') !== null) {
                    await page.waitFor(closePage);
                    await page.close();
                    return resolve();
                }

                const elHandle = await page.$(priceInput);
                const oldValue = (await getValue(elHandle, 'value')).replace(' ', '').replace(',', '.');;
                const value = data.value.replace(' ', '').replace(',', '.');

                const newValue = data.type === 'fixed' ?
                    changeFixed(parseFloat(value), parseFloat(oldValue)) :
                    changePercentage(parseFloat(value), parseFloat(oldValue));

                await page.waitFor(priceChange);
                await page.click(priceInput);
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
                resolve();
            } catch (err) {
                fileService.log(`Problem in ${advId}: ${err}`);
                console.error(`Product ${advId} failed!`);
                await page.close();
                problematicAdvs.push(advId);
                resolve();
            }
        }));
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