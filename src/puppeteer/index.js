const puppeteer = require('puppeteer');

const login = require('./login');
const advs = require('./advs');
const statistics = require('./statistics');

let browser = null;

const launch = async () => {
    if (!browser) {
        browser = await puppeteer.launch({headless: false});
        const mainPage = (await browser.pages())[0];
        await login(mainPage);
    }
};

const changePrice = async data => {
    return advs.editAll(browser, data);
};

const fetchStatistics = async () => {
    return statistics.fetch(browser);
};

const close = async () => {
    if (browser) {
        await browser.close();
        browser = null;
    }
};

module.exports = { launch, changePrice, fetchStatistics, close };