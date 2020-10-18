const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')('CITIES');
const citiesService = require('../services/citiesService');

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all cities...');
        const response = await citiesService.getAll();

        logger.info('Cities fetched successfully!');
        res.status(200).send(response);
    } catch (err) {
        logger.error(`An error occurred during fetching cities: ${err}`);
        res.sendStatus(500);
    }
});

router.get('/:cityIdentifier', async (req, res) => {
    try {
        const cityId = req.params.cityIdentifier;
        logger.info(`Getting city with ID '${cityId}'...`);
        const city = await citiesService.getOneById(cityId);
        if (city) {
            logger.info('City retrieved successfully!');
            res.status(200).send(city);
        } else {
            logger.info(`City with ID '${cityId}' doesn't exist`);
            res.sendStatus(404);
        }
    } catch (err) {
        logger.error(`An error occurred during getting city : ${err}`);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const city = req.body;
        const dbCity = await citiesService.getOneByOlxId(city.olxId);
        if (dbCity) {
            logger.info(`City with olxId '${dbCity.olxId}' already exists!`);
            return res.sendStatus(409);
        }

        logger.info(`Creating city '${city.olxId}'...`);
        const response = await citiesService.create(city);
        logger.info('City created successfully!');
        res.status(201).send(response);
    } catch (err) {
        logger.error(`An error occurred during creating city : ${err}`);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const dbCity = await citiesService.getOneById(cityId);
        if (!dbCity) {
            logger.info(`City with ID '${cityId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        const updated = req.body;
        const cityWithSameOlxId = await citiesService.getOneByOlxId(updated.olxId);
        if (cityWithSameOlxId && cityWithSameOlxId.id !== cityId) {
            logger.info(`Another city with olxId '${updated.olxId}' already exists!`);
            return res.sendStatus(409);
        }

        logger.info(`Updating city with ID '${cityId}'...`);
        const response = await citiesService.update(cityId, updated);
        logger.info('City updated successfully!');
        res.status(201).send(response);
    } catch (err) {
        logger.error(`An error occurred during updating city : ${err}`);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cityId = req.params.id;
        const dbCity = await citiesService.getOneById(cityId);
        if (!dbCity) {
            logger.info(`City with ID '${cityId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        logger.info(`Deleting city with ID '${cityId}'...`);
        await citiesService.delete(cityId);
        logger.info('City deleted successfully!');
        res.sendStatus(202);
    } catch (err) {
        logger.error(`An error occurred during deleting city : ${err}`);
        res.sendStatus(500);
    }
});


router.post('/statistics', async (req, res) => {
    try {
        const { cityIds, writeToExcel, getFromDb } = req.body;

        logger.info('Fetching cities from DB...');
        const cities = await citiesService.getMultipleByIds(cityIds);
        const filtered = cities.filter(city => cityIds.find(id => id === city.id));

        logger.info('Collecting statistics for chosen cities...');
        citiesService.getStatistics({ cities: filtered, writeToExcel, getFromDb });
        res.sendStatus(200);
    } catch (err) {
        logger.error(`An error occurred during collecting cities statistics: ${err}`);
        res.sendStatus(500);
    }
});

module.exports = router;