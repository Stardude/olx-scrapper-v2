const {google} = require("googleapis");
const {promisify} = require("util");
const logger = require("../../utils/logger")("SPREADSHEET_CITY");

class Spreadsheet {
    constructor (spreadsheetId, sheetName, jwtClient) {
        this.spreadsheetId = spreadsheetId;
        this.sheetName = sheetName;
        this.jwtClient = jwtClient;
        this.spreadsheets = google.sheets("v4").spreadsheets;

        this.firstCityRow = 3;
    }

    async apply (context, method, params) {
        params = params || {};
        const getFunc = promisify(context[method]).bind(context);
        return getFunc({
            ...params,
            spreadsheetId: this.spreadsheetId,
            auth: this.jwtClient
        });
    }

    async writeCities (list) {
        const requests = [];
        list.forEach((city, index) => {
            requests.push({
                range: `${this.sheetName}!B${index + this.firstCityRow}:G${index + this.firstCityRow}`,
                values: [
                    [
                        city.olxId,
                        city.name,
                        city.generalAmount,
                        city.topAmount,
                        city.myGeneralAmount,
                        city.myTopAmount
                    ]
                ]
            });
        });

        try {
            await this.apply(this.spreadsheets.values, "batchUpdate", {
                resource: {
                    data: requests,
                    valueInputOption: "USER_ENTERED"
                }
            });
            logger.info("Cities successfully stored in spreadsheet!");
        } catch (e) {
            logger.error(`An error occurred during writing cities: ${e}`);
            throw e;
        }
    }

    async writeData (list) {
        await this.writeCities(list);
    }
}

module.exports = Spreadsheet;