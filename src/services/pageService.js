const constants = require('./puppeter/constants');

const { xhrPageNotFound } = constants.URLs;

module.exports.loopThroughPages = async (browser, list, action, options) => {
    const pagesPerIteration = options.pagesPerIteration;

    const promises = [];
    const errors = [];
    const successes = [];
    for (let i = 0; i < list.length; i++) {
        promises.push((async () => {
            const page = await browser.newPage();
            try {
                await page.goto(list[i].url, {waitUntil: 'domcontentloaded', timeout: 0});

                // Catch XHR failed response
                await new Promise((resolve, reject) => {
                    page.on('response', async (response) => {
                        if (response.url().match(xhrPageNotFound)){
                            if (!response.ok()) {
                                reject('Page not found');
                            } else {
                                resolve();
                            }
                        }
                    });
                });

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