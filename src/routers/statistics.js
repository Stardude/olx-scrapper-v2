const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')('STATISTICS');
const statisticsService = require('../services/statisticsService');

router.post('/', async (req, res) => {
    try {
        const { writeToExcel, getFromDb } = req.body;

        logger.info('Collecting all statistics...');
        statisticsService.collect({ writeToExcel, getFromDb });
        res.sendStatus(200);
    } catch (err) {
        logger.error(`An error occurred during collecting statistics: ${err}`);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all statistics...');
        const response = await statisticsService.get();

        logger.info('Statistics fetched successfully!');
        res.status(200).send(response);
    } catch (err) {
        logger.error(`An error occurred during fetching statistics: ${err}`);
        res.sendStatus(500);
    }
});

module.exports = router;