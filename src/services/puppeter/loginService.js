const fs = require('fs');
const path = require('path');
const { COOKIES_PATH } = require('../../configStorage');
const logger = require('../../utils/logger')('LOGIN');
const constants = require('./constants');
const configurationService = require('../configurationService');

const ROOT_DIR = '../../../';

const { usernameInput, passwordInput, editAdvLink } = constants.SELECTORS;
const { host, mainPath } = constants.URLs;

const useCredentials = async (page, email, password) => {
    logger.info('Entering credentials...');
    await page.click(usernameInput);
    await page.keyboard.type(email);

    await page.click(passwordInput);
    await page.keyboard.type(password);

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    // await page.waitForSelector(editAdvLink, {timeout: 0});
    logger.info('User has successfully log in!');
    logger.info('Saving cookies...');
    const cookies = await page.cookies();
    fs.writeFileSync(path.join(__dirname, ROOT_DIR, COOKIES_PATH), JSON.stringify(cookies, null, 2));
    logger.info(`Cookies stored in ${COOKIES_PATH}`);
};

module.exports.login = async (page) => {
    const { olxEmail, olxPassword } = await configurationService.get();
    let cookiesString;
    try {
        cookiesString = fs.readFileSync(path.join(__dirname, ROOT_DIR, COOKIES_PATH));
        if (cookiesString.toString() !== '') {
            logger.info('Setting cookies...');
            const cookiesToSet = JSON.parse(cookiesString);
            await page.setCookie(...cookiesToSet);
            await page.goto(host + mainPath, {waitUntil: 'domcontentloaded', timeout: 0});
            await page.evaluate(() => window.stop());

            // if (await page.$(editAdvLink) === null) {
            //     logger.info('Cookies are expired!');
            //     return useCredentials(page, olxEmail, olxPassword);
            // }

            logger.info('Cookies successfully set!');
            return;
        }

        throw new Error();
    } catch (e) {
        return useCredentials(page, olxEmail, olxPassword);
    }
};