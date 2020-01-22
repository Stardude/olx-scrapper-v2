const puppeteer = require('puppeteer');

const login = require('./login');
const advs = require('./advs');
const statistics = require('./statistics');

let browser = null;

const launch = async () => {
    browser = await puppeteer.launch({headless: false});
    const mainPage = await browser.newPage();
    await login(mainPage);
};

const changePrice = async data => {
    return await advs.editAll(browser, data);
};

const fetchStatistics = async () => {
    return await statistics.fetch(browser);
};

const close = async () => {
    await browser.close();
};

module.exports = { launch, changePrice, fetchStatistics, close };