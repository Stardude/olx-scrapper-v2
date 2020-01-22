const fs = require('fs').promises;
const config = require('config');
const { email, password } = require('../../config/auth');

const { cookiesFilePath } = config.Authorization;
const { usernameInput, passwordInput, editAdvLink } = config.Selectors;
const { host, mainPath } = config.Urls;

const useCookies = async (cookiesString, page) => {
    console.log('Setting cookies...');
    const cookiesToSet = JSON.parse(cookiesString);
    await page.setCookie(...cookiesToSet);
    await page.goto(host + mainPath, {waitUntil: 'load', timeout: 0});
    await page.waitForSelector(editAdvLink, {timeout: 5000});
    console.log('Cookies successfully set!');
};

const useCredentials = async page => {
    console.log('Entering credentials...');
    await page.goto(host + mainPath, {waitUntil: 'load', timeout: 0});

    await page.click(usernameInput);
    await page.keyboard.type(email);

    await page.click(passwordInput);
    await page.keyboard.type(password);

    await page.waitForSelector(editAdvLink, {timeout: 0});
    console.log('User has successfully log in!');
    console.log('Saving cookies...');
    const cookies = await page.cookies();
    await fs.writeFile(cookiesFilePath, JSON.stringify(cookies, null, 2));
    console.log(`Cookies stored in ${cookiesFilePath}`);
};

module.exports = async (page) => {
    let cookiesString;
    try {
        cookiesString = await fs.readFile(config.Authorization.cookiesFilePath);
        if (cookiesString.toString() !== '') {
            return await useCookies(cookiesString, page);
        } else {
            throw new Error();
        }
    } catch (e) {
        return await useCredentials(page);
    }
};