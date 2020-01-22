const {google} = require('googleapis');
const {promisify} = require('util');
const privateKey = require('../../config/google-api');
const {GoogleAPI} = require('../../config/auth');
const Spreadsheet = require('./spreadsheetService');

let jwtClient = null;

module.exports = {

    connect: async () => {
        jwtClient = new google.auth.JWT(
            privateKey.client_email,
            null,
            privateKey.private_key,
            GoogleAPI.scopes
        );

        try{
            await promisify(jwtClient.authorize).bind(jwtClient)();
            console.log('Google Sheet API connected!');
        } catch (e) {
            console.error(e);
        }
    },

    writeStatisticToSpreadsheet: async data => {
        const spreadsheet = new Spreadsheet(
            GoogleAPI.spreadsheetId,
            GoogleAPI.sheetName,
            jwtClient);

        await spreadsheet.writeData(data);
    }
};