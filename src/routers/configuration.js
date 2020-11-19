const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')('CONFIGURATION');
const configurationService = require('../services/configurationService');

router.post('/', async (req, res) => {
    try {
        const { configuration } = req.body;

        logger.info('Updating configuration...');
        const response = await configurationService.update(configuration);

        logger.info('Configuration updated!');
        res.status(200).send(response);
    } catch (err) {
        logger.error(`An error occurred during updating configuration: ${err}`);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all configuration...');
        const response = await configurationService.get();

        logger.info('Configuration fetched successfully!');
        res.status(200).send(response);
    } catch (err) {
        logger.error(`An error occurred during fetching configuration: ${err}`);
        res.sendStatus(500);
    }
});

router.delete('/cookies', async (req, res) => {
    try {
        logger.info('Removing cookies...');
        await configurationService.removeCookies();

        logger.info('Cookies removed successfully!');
        res.sendStatus(200);
    } catch (err) {
        logger.error(`An error occurred during removing cookies: ${err}`);
        res.sendStatus(500);
    }
});

module.exports = router;