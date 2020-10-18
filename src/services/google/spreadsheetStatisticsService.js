const {google} = require('googleapis');
const {promisify} = require('util');
const formatHelper = require('./formatHelper');
const logger = require('../../utils/logger')('SPREADSHEET_STATISTICS');

class Spreadsheet {
    constructor (spreadsheetId, sheetName, jwtClient) {
        this.spreadsheetId = spreadsheetId;
        this.sheetName = sheetName;
        this.jwtClient = jwtClient;
        this.spreadsheets = google.sheets('v4').spreadsheets;

        this.rowsHeight = 12;
        this.rowsDividers = 2;
        this.firstProductRow = 3;
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

    async appendEmptyRows (productsAmount) {
        const necessaryRowCount = (productsAmount * (this.rowsHeight + this.rowsDividers)) + this.firstProductRow;
        const availableRowCount = this.rowCount;

        if (necessaryRowCount - availableRowCount <= 0) {
            return;
        }

        const rowsAmount = (necessaryRowCount - availableRowCount) + this.rowsHeight + this.rowsDividers;

        await this.apply(this.spreadsheets, 'batchUpdate', {
            resource: {
                requests: [
                    {
                        appendDimension: {
                            sheetId: this.sheetId,
                            dimension: "ROWS",
                            length: rowsAmount
                        }
                    }
                ]
            }
        });

        logger.info(`New ${rowsAmount} rows appended to spreadsheet`);
    }

    async getSheetProperties () {
        const spreadsheetProps = await this.apply(this.spreadsheets,'get', {});
        const sheet = spreadsheetProps.data.sheets
            .find(sheet => sheet.properties.title === this.sheetName);

        this.sheetId = sheet.properties.sheetId;
        this.rowCount = sheet.properties.gridProperties.rowCount;
        this.columnCount = sheet.properties.gridProperties.columnCount;
    }

    async getProductIds () {
        const range = `${this.sheetName}!A:A`;
        const {data} = await this.apply(this.spreadsheets.values, 'get', {
            range
        });
        this.productIds = data.values ? data.values.map((value, key) => ({ value: value[0], row: key + 1 }))
            .filter(product => !isNaN(product.value)) : [];
        this.newProductRowPosition = data.values ?
            this.productIds.slice(-1)[0].row - 1 + this.rowsHeight + this.rowsDividers :
            this.firstProductRow;
    }

    async setCities (statistics) {
        const requests = [];
        this.productIds.forEach(product => {
            const data = statistics[product.value];
            data && requests.push({
                range: `${this.sheetName}!A${product.row + 2}`,
                values: [
                    [data.cityName]
                ]
            });
        });

        try {
            await this.apply(this.spreadsheets.values, 'batchUpdate', {
                resource: {
                    data: requests,
                    valueInputOption: 'USER_ENTERED'
                }
            });
            logger.info('Cities successfully added to spreadsheet!');
        } catch (e) {
            logger.error(`An error occurred during adding cities tp spreadsheet: ${e}`);
            throw e;
        }
    }

    letter(columnId) {
        return String.fromCharCode(64 + columnId);
    }

    async createNewTemplates (newProducts) {
        if (newProducts.length === 0) {
            return;
        }

        const data = [];
        const requests = [];
        newProducts.forEach(product => {
            data.push({
                range: `${this.sheetName}!A${this.newProductRowPosition}:B${this.newProductRowPosition + this.rowsHeight - 1}`,
                values: [
                    ['Код товару', 'ДАТА               =>'],
                    [product, 'ТОП                 =>'],
                    ['Місто', 'РЕКЛАМА       =>'],
                    [null, 'ІНШІ ДІЇ           =>'],
                    ['*****************', 'ПЕРЕГЛЯДИ   =>'],
                    ['*****************', 'різниця'],
                    ['*****************', 'ТЕЛЕФОН       =>'],
                    ['*****************', 'різниця'],
                    ['*****************', 'ОБРАНЕ          =>'],
                    ['*****************', 'різниця'],
                    ['*****************', 'ПОВІДОМЛЕННЯ   =>'],
                    ['*****************', 'різниця']
                ]
            });

            requests.push(
                ...formatHelper.borders(this.sheetId, this.newProductRowPosition, this.rowsHeight),
                ...formatHelper.cells(this.sheetId, this.newProductRowPosition, this.rowsHeight)
            );

            this.productIds.push({
                value: product,
                row: this.newProductRowPosition + 1
            });

            this.newProductRowPosition = this.newProductRowPosition + this.rowsHeight + this.rowsDividers;
        });

        try {
            await this.apply(this.spreadsheets.values, 'batchUpdate', {
                resource: {
                    data,
                    valueInputOption: 'RAW'
                }
            });

            await this.apply(this.spreadsheets, 'batchUpdate', {
                resource: { requests }
            });
            logger.info(`Templates for new ${newProducts.length} products created!`);
        } catch (e) {
            logger.error(`An error occurred during creating templates for new product: ${e}`);
            throw e;
        }
    }

    getCurrentDate () {
        return `${('0' + new Date().getDate()).slice(-2)}.${('0' + (+(new Date().getMonth()) + 1)).slice(-2)}`;
    }

    async getLastColumn () {
        const range = `${this.sheetName}!A3:ZZ${this.productIds.slice(-1)[0].row + this.rowsHeight - 2}`;
        try {
            const {data} = await this.apply(this.spreadsheets.values, 'get', {
                range
            });

            let lastColumn = 0;
            data.values.forEach(value => {
                lastColumn = value.length >= lastColumn ? value.length : lastColumn;
            });

            return ++lastColumn;
        } catch (e) {
            logger.error(`Can't get last column: ${e}`);
            throw e;
        }
    }

    async addNewStatistics (statistics) {
        const date = this.getCurrentDate();
        const lastColumn = await this.getLastColumn();

        const requests = [];
        this.productIds.forEach(product => {
            const letter = this.letter(lastColumn);
            const previousLetter = this.letter(lastColumn - 1);
            const data = statistics[product.value];
            data && requests.push({
                range: `${this.sheetName}!${letter}${product.row - 1}:${letter}${product.row + this.rowsHeight - 2}`,
                values: [
                    [date],
                    [null],
                    [null],
                    [null],
                    [data.views],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 3}-${previousLetter}${product.row + 3}`],
                    [data.phones],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 5}-${previousLetter}${product.row + 5}`],
                    [data.chosens],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 7}-${previousLetter}${product.row + 7}`],
                    [data.messages],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 9}-${previousLetter}${product.row + 9}`]
                ]
            });
        });

        try {
            await this.apply(this.spreadsheets.values, 'batchUpdate', {
                resource: {
                    data: requests,
                    valueInputOption: 'USER_ENTERED'
                }
            });
            logger.info('Statistics successfully stored in spreadsheet!');
        } catch (e) {
            logger.error(`An error occurred during writing statistics: ${e}`);
            throw e;
        }
    }

    async writeData (statistics) {
        await this.getSheetProperties();
        await this.getProductIds();

        const newProducts = [];
        for (let key in statistics) {
            let productId = this.productIds.find(product => product.value === key);
            if (!productId) {
                newProducts.push(key);
            }
        }

        await this.appendEmptyRows([
            ...this.productIds,
            ...newProducts
        ].length);

        await this.createNewTemplates(newProducts);
        await this.addNewStatistics(statistics);
        await this.setCities(statistics);
    }
}

module.exports = Spreadsheet;