const puppeteer = require('puppeteer');

const loginService = require('./loginService');

let browserInst = null;

module.exports.launch = async () => {
    browserInst = await puppeteer.launch({headless: false});
    return browserInst;
};

module.exports.login = async (browser) => {
    const mainPage = (await browser.pages())[0];
    return loginService.login(mainPage);
};

module.exports.launchAndLogin = async () => {
    const browser = await exports.launch();
    await exports.login(browser);
    return browser;
};

module.exports.close = async () => {
    if (browserInst) {
        await browserInst.close();
        browserInst = null;
    }
};