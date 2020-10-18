(async () => {
    const express = require("express");
    const config = require("./configStorage");

    const routing = require("./routing");
    const middlewares = require("./middlewares");

    const configurationService = require("./services/configurationService");

    const app  = express();
    const PORT = config.PORT;

    try {
        middlewares(app);
        routing(app);
        middlewares.loadStatic(app);

        await require(`./dao`).connect();

        const configuration = await configurationService.get();
        if (!configuration) {
            await configurationService.createDefault();
        }

        await app.listen(PORT);
        console.log(`The server is running on port ${PORT}`);
    } catch (err) {
        console.error(`An error occurred during launching: ${err}`);
    }
})();