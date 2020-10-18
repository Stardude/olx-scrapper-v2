const constants = require('./puppeter/constants');

const { page404 } = constants.SELECTORS;

module.exports.loopThroughPages = async (browser, list, action, options) => {
    const pagesPerIteration = options.pagesPerIteration;

    const promises = [];
    const errors = [];
    const successes = [];
    for (let i = 0; i < list.length; i++) {
        promises.push((async () => {
            try {
                const page = await browser.newPage();
                await page.goto(list[i].url, {waitUntil: 'load', timeout: 0});
                try {
                    await page.waitForSelector(page404, {timeout: 5000});
                    throw new Error('Page not found');
                } catch (err) {
                    if (err.message === 'Page not found') {
                        throw err;
                    }
                }

                const result = await action(page, list[i]);
                successes.push(result);
                await page.close();
            } catch (err) {
                errors.push({
                    reason: err,
                    data: list[i]
                });
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