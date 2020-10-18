const config = require('config');

module.exports = {
    PORT: process.env.PORT || config.Application.port,
    DATABASE_IMPL: process.env.DATABASE_IMPL || config.Database.TYPE,
    DATABASE_PATH: process.env.DATABASE_PATH || config.Database.PATH,
    COOKIES_PATH: process.env.COOKIES_PATH || config.Authorization.cookiesFilePath,
    ADVS_PER_ITERATION: process.env.ADVS_PER_ITERATION || config.advsAmountPerIteration,
    CITIES_PER_ITERATION: process.env.CITIES_PER_ITERATION || config.citiesAmountPerIteration,
    ONLY_ACTIVE: process.env.ONLY_ACTIVE || config.onlyActive,
};