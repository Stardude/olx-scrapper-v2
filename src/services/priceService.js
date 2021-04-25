const puppeterService = require('./puppeter');
const pageService = require('./pageService');
const recordsService = require('./recordsService');
const configurationService = require('./configurationService');
const constants = require('./puppeter/constants');
const { getValue } = require('../utils/puppeterUtils');
const logger = require('../utils/logger')('PRICE');

const { priceInput, saveAdvBtn, categoryButton } = constants.SELECTORS;
const { host, editAdvPath, successEditingPath } = constants.URLs;
const { priceChange, saveBtnClick, closePage, keyboardType } = constants.DELAYS;

const getEditUrls = (records) => {
    const urls = [];
    for (let i = 0; i < records.length; i++) {
        urls.push({
            data: records[i],
            url: (host + editAdvPath)
                .replace('<CODE>', records[i].olxId)
                .replace('/uk/', '/d/uk/')
        });
    }
    return urls;
};

const formatPrice = value => value.replace(' ', '').replace(',', '.');
const changeFixed = (value, old) => (old + value);
const changePercentage = (value, old) => Math.round(old + (old * value / 100));

const handleEditPage = (priceData, onlyActive) => {
    return async (page, urlData) => {
        const { data: record  } = urlData;
        try {
            logger.info(`Processing adv '${record.olxId}'...`);
            await page.waitForSelector(priceInput);

            if (onlyActive && await page.$(categoryButton) !== null) {
                await page.waitFor(closePage);
                throw new Error(`Adv ${record.olxId} is not active`);
            }

            const elHandle = await page.$(priceInput);
            const oldValue = formatPrice(await getValue(elHandle, 'value'));
            const value = formatPrice(priceData.value);

            const newValue = priceData.type === 'fixed' ?
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
            await page.keyboard.type(`${newValue}`, { delay: keyboardType });

            await page.waitFor(saveBtnClick);
            await page.click(saveAdvBtn);
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

            if (!page.url().match(successEditingPath)) {
                throw new Error(`Something went wrong with updating adv ${record.olxId}`);
            }

            await recordsService.update(record.id, {
                ...record,
                lastPriceChange: new Date().toISOString(),
                lastPriceStatus: true
            });
            logger.info(`Adv '${record.olxId}' price changed!`);
        } catch (err) {
            logger.error(`An error occurred during price change for adv '${record.olxId}': ${err}`);
            await recordsService.update(record.id, {
                ...record,
                lastPriceChange: new Date().toISOString(),
                lastPriceStatus: false
            });
        }
    };
};

module.exports.changePrice = async (records, priceData) => {
    const { priceChangeAdvsAmount, priceChangeOnlyActive } = await configurationService.get();
    const browser = await puppeterService.launchAndLogin();

    const urls = getEditUrls(records);
    const { errors } = await pageService.loopThroughPages(browser, urls, handleEditPage(priceData, priceChangeOnlyActive), {
        pagesPerIteration: priceChangeAdvsAmount
    });

    if (errors.length) {
        for (let i = 0; i < errors.length; i++) {
            const { data: { data: record }, reason: err } = errors[i];
            logger.error(`An error occurred during managing with page for adv '${record.olxId}': ${err}`);
            await recordsService.update(record.id, {
                ...record,
                lastPriceChange: new Date().toISOString(),
                lastPriceStatus: false
            });
        }
    }

    await puppeterService.close();
};