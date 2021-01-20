const constants = require('./puppeter/constants');

const { page404 } = constants.SELECTORS;

module.exports.loopThroughPages = async (browser, list, action, options) => {
    const pagesPerIteration = options.pagesPerIteration;

    const promises = [];
    const errors = [];
    const successes = [];
    for (let i = 0; i < list.length; i++) {
        promises.push((async () => {
            const page = await browser.newPage();
            try {
                await page.goto(list[i].url, {waitUntil: 'load', timeout: 0});
                if (await page.$(page404) !== null) {
                    throw new Error('Page not found');
                }

                const result = await action(page, list[i]);
                successes.push(result);
                await page.close();
            } catch (err) {
                errors.push({
                    reason: err,
                    data: list[i]
                });
                await page.close();
            }
        })());

        if (promises.length === pagesPerIteration || i === list.length - 1) {
            try {
                await Promise.all(promises);
            } catch {}
            promises.splice(0, promises.length);
        }
    }

    return { successes, errors };
};