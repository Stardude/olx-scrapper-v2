const {google} = require('googleapis');
const {promisify} = require('util');
const formatHelper = require('./formatHelper');

class Spreadsheet {
    constructor (spreadsheetId, sheetName, jwtClient) {
        this.spreadsheetId = spreadsheetId;
        this.sheetName = sheetName;
        this.jwtClient = jwtClient;
        this.spreadsheets = google.sheets('v4').spreadsheets;

        this.rowsHeight = 10;
        this.rowsDividers = 2;
        this.firstProductRow = 3;
    }

    async apply (context, method, params) {
        const getFunc = promisify(context[method]).bind(context);
        return await getFunc({
            ...params,
            auth: this.jwtClient
        });
    }

    async getSheetId () {
        const spreadsheetProps = await this.apply(this.spreadsheets,'get', {
            spreadsheetId: this.spreadsheetId
        });
        this.sheetId = spreadsheetProps.data.sheets
            .find(sheet => sheet.properties.title === this.sheetName).properties.sheetId;
    }

    async getProductIds () {
        const range = `${this.sheetName}!A:A`;
        const {data} = await this.apply(this.spreadsheets.values, 'get', {
            spreadsheetId: this.spreadsheetId,
            range
        });
        this.productIds = data.values ? data.values.map((value, key) => ({ value: value[0], row: key + 1 }))
            .filter(product => !isNaN(product.value)) : [];
        this.newProductRowPosition = data.values ?
            this.productIds.slice(-1)[0].row - 1 + this.rowsHeight + this.rowsDividers :
            this.firstProductRow;
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
                spreadsheetId: this.spreadsheetId,
                resource: {
                    data,
                    valueInputOption: 'RAW'
                }
            });

            await this.apply(this.spreadsheets, 'batchUpdate', {
                spreadsheetId: this.spreadsheetId,
                resource: { requests }
            });
            console.log('Templates for new products created!');
        } catch (e) {
            console.error(e);
        }
    }

    getCurrentDate () {
        return `${('0' + new Date().getDate()).slice(-2)}.${('0' + new Date().getMonth() + 1).slice(-2)}`;
    }

    async getLastColumn () {
        const range = `${this.sheetName}!A3:ZZ${this.productIds.slice(-1)[0].row + this.rowsHeight - 2}`;
        try {
            const {data} = await this.apply(this.spreadsheets.values, 'get', {
                spreadsheetId: this.spreadsheetId,
                range
            });

            let lastColumn = 0;
            data.values.forEach(value => {
                lastColumn = value.length >= lastColumn ? value.length : lastColumn;
            });

            return ++lastColumn;
        } catch (e) {
            console.error(e);
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
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 1}-${previousLetter}${product.row + 1}`],
                    [data.phones],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 3}-${previousLetter}${product.row + 3}`],
                    [data.chosen],
                    [lastColumn === 3 ? 0 : `=${letter}${product.row + 5}-${previousLetter}${product.row + 5}`]
                ]
            });
        });

        try {
            await this.apply(this.spreadsheets.values, 'batchUpdate', {
                spreadsheetId: this.spreadsheetId,
                resource: {
                    data: requests,
                    valueInputOption: 'USER_ENTERED'
                }
            });
            console.log('Statistics successfully stored in spreadsheet!');
        } catch (e) {
            console.error(e)
        }
    }

    async writeData (statistics) {
        await this.getSheetId();
        await this.getProductIds();

        const newProducts = [];
        for (let key in statistics) {
            let productId = this.productIds.find(product => product.value === key);
            if (!productId) {
                newProducts.push(key);
            }
        }

        await this.createNewTemplates(newProducts);
        await this.addNewStatistics(statistics);
    }
}

module.exports = Spreadsheet;