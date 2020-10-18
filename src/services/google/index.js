const {google} = require('googleapis');
const {promisify} = require('util');
const privateKey = require('../../../config/google-api');
const SpreadsheetStatistics = require('./spreadsheetStatisticsService');
const SpreadsheetCities = require('./spreadsheetCitiesService');
const configurationService = require('../configurationService');
const logger = require('../../utils/logger')('GOOGLE');

let jwtClient = null;

module.exports.connect = async () => {
    jwtClient = new google.auth.JWT(
        privateKey.client_email,
        null,
        privateKey.private_key,
        privateKey.scopes
    );

    try{
        await promisify(jwtClient.authorize).bind(jwtClient)();
        logger.info('Google Sheet API connected!');
    } catch (err) {
        logger.error(`An error occurred during connection to GoogleApi: ${err}`);
        throw err;
    }
};

module.exports.writeStatisticToSpreadsheet = async data => {
    const { googleSpreadsheetId, googleRecordsSheetName } = await configurationService.get();
    if (!jwtClient) {
        await exports.connect();
    }

    const spreadsheet = new SpreadsheetStatistics(
        googleSpreadsheetId,
        googleRecordsSheetName,
        jwtClient
    );

    await spreadsheet.writeData(data);
};

module.exports.writeCitiesToSpreadsheet = async data => {
    const { googleSpreadsheetId, googleCitiesSheetName } = await configurationService.get();
    if (!jwtClient) {
        await exports.connect();
    }

    const spreadsheet = new SpreadsheetCities(
        googleSpreadsheetId,
        googleCitiesSheetName,
        jwtClient
    );

    await spreadsheet.writeData(data);
};