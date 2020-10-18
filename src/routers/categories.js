const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')('CATEGORIES');
const categoryService = require('../services/categoryService');
const recordsService = require('../services/recordsService');
const priceService = require('../services/priceService');

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all categories...');
        const response = await categoryService.getAll();

        logger.info('Categories fetched successfully!');
        res.status(200).send(response);
    } catch (err) {
        logger.error(`An error occurred during fetching categories: ${err}`);
        res.sendStatus(500);
    }
});

router.get('/:categoryIdentifier', async (req, res) => {
    try {
        if (req.method === 'HEAD') {
            const categoryName = req.params.categoryIdentifier;
            logger.info(`Getting category with name '${categoryName}'...`);
            const category = await categoryService.getOneByName(categoryName);
            if (!category) {
                logger.info(`Category with name '${categoryName}' doesn't exist!`);
                res.sendStatus(200);
            } else {
                logger.info(`Category with name '${categoryName}' exists!`);
                res.sendStatus(409);
            }
        } else {
            const categoryId = req.params.categoryIdentifier;
            logger.info(`Getting category with ID '${categoryId}'...`);
            const category = await categoryService.getOneById(categoryId);
            if (category) {
                logger.info('Category retrieved successfully!');
                res.status(200).send(category);
            } else {
                logger.info(`Category with ID '${categoryId}' doesn't exist`);
                res.sendStatus(404);
            }
        }
    } catch (err) {
        logger.error(`An error occurred during getting category : ${err}`);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const category = req.body;
        const dbCategory = await categoryService.getOneByName(category.name);
        if (dbCategory) {
            logger.info(`Category with name '${dbCategory.name}' already exists!`);
            return res.sendStatus(409);
        }

        logger.info(`Creating category '${category.name}'...`);
        const response = await categoryService.create(category);
        logger.info('Category created successfully!');
        res.status(201).send(response);
    } catch (err) {
        logger.error(`An error occurred during creating category : ${err}`);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const dbCategory = await categoryService.getOneById(categoryId);
        if (!dbCategory) {
            logger.info(`Category with ID '${categoryId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        const updated = req.body;
        const categoryWithSameName = await categoryService.getOneByName(updated.name);
        if (categoryWithSameName && categoryWithSameName.id !== categoryId) {
            logger.info(`Another category with name '${updated.name}' already exists!`);
            return res.sendStatus(409);
        }

        logger.info(`Updating category with ID '${categoryId}'...`);
        const response = await categoryService.update(categoryId, updated);
        logger.info('Category updated successfully!');
        res.status(201).send(response);
    } catch (err) {
        logger.error(`An error occurred during updating category : ${err}`);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const dbCategory = await categoryService.getOneById(categoryId);
        if (!dbCategory) {
            logger.info(`Category with ID '${categoryId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        logger.info(`Deleting category with ID '${categoryId}'...`);
        await categoryService.delete(categoryId);
        logger.info('Category deleted successfully!');
        res.sendStatus(202);
    } catch (err) {
        logger.error(`An error occurred during deleting category : ${err}`);
        res.sendStatus(500);
    }
});

router.get('/:categoryIdentifier/records', async (req, res) => {
    try {
        const categoryId = req.params.categoryIdentifier;
        logger.info(`Getting records of category with ID '${categoryId}'...`);
        const result = await recordsService.getForCategory(categoryId);

        logger.info('Category records retrieved successfully!');
        res.status(200).send(result);
    } catch (err) {
        logger.error(`An error occurred during getting category records : ${err}`);
        res.sendStatus(500);
    }
});

router.post('/:categoryIdentifier/records', async (req, res) => {
    try {
        const categoryId = req.params.categoryIdentifier;
        const record = req.body;
        const dbRecord = await recordsService.getOneByOlxId(categoryId, record.olxId);
        if (dbRecord) {
            logger.info(`Record with OLX ID '${dbRecord.olxId}' for category '${categoryId}' already exists!`);
            return res.sendStatus(409);
        }

        logger.info(`Creating record for category with ID '${categoryId}'...`);
        const result = await recordsService.create(record);

        logger.info('Category record created successfully!');
        res.status(200).send(result);
    } catch (err) {
        logger.error(`An error occurred during creating category record : ${err}`);
        res.sendStatus(500);
    }
});

router.put('/:categoryIdentifier/records/:recordId', async (req, res) => {
    try {
        const { categoryIdentifier: categoryId, recordId } = req.params;

        const dbRecord = await recordsService.getOneById(recordId);
        if (!dbRecord) {
            logger.info(`Record with ID '${recordId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        const updated = req.body;
        const recordWithOlxId = await recordsService.getOneByOlxId(categoryId, updated.olxId);
        if (recordWithOlxId && recordWithOlxId.id !== parseInt(recordId)) {
            logger.info(`Another record with OLX ID '${updated.olxId}' already exists in category with ID '${categoryId}'!`);
            return res.sendStatus(409);
        }

        logger.info(`Updating record with ID '${recordId}'...`);
        const response = await recordsService.update(recordId, updated);
        logger.info('Record updated successfully!');
        res.status(201).send(response);
    } catch (err) {
        logger.error(`An error occurred during creating category record : ${err}`);
        res.sendStatus(500);
    }
});

router.delete('/:categoryIdentifier/records/:recordId', async (req, res) => {
    try {
        const { categoryIdentifier: categoryId, recordId } = req.params;
        const dbRecord = await recordsService.getOneById(recordId);
        if (!dbRecord) {
            logger.info(`Record with ID '${recordId}' doesn't exists!`);
            return res.sendStatus(404);
        }

        logger.info(`Deleting record with ID '${recordId}' from category with ID '${categoryId}'...`);
        await recordsService.delete(recordId);
        logger.info('Record deleted successfully!');
        res.sendStatus(202);
    } catch (err) {
        logger.error(`An error occurred during deleting category record : ${err}`);
        res.sendStatus(500);
    }
});

router.post('/:categoryIdentifier/changePrice', async (req, res) => {
    try {
        const categoryId = req.params.categoryIdentifier;
        const { recordIds, priceData } = req.body;

        logger.info('Fetching records from DB...');
        const { records } = await recordsService.getForCategory(categoryId);
        const filtered = records.filter(record => recordIds.find(id => id === record.id));

        logger.info(`Changing price...`);
        priceService.changePrice(filtered, priceData);
        res.sendStatus(200);
    } catch (err) {
        logger.error(`An error occurred during changing price : ${err}`);
        res.sendStatus(500);
    }
});

module.exports = router;