const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const puppeteer = require('./src/puppeteer');
const fileService = require('./src/fileService');
const googleService = require('./src/googleApi/googleService');

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(publicPath));

app.post('/changePrice', async (req, res) => {
    await puppeteer.launch();
    const results = await puppeteer.changePrice(req.body);
    if (results.offset === null) {
        await puppeteer.close();
    }
    res.send(results);
});

app.post('/close', async (req, res) => {
    await puppeteer.close();
    res.sendStatus(201);
});

app.get('/categories', async (req, res) => {
    const result = await fileService.getListOfAdvs();
    res.send(result);
});

app.post('/categories/:category', async (req, res) => {
    const result = await fileService.updateCategoryList(req.params.category, req.body);
    res.send(result);
});

app.get('/statistics', async (req, res) => {
    await puppeteer.launch();
    res.sendStatus(200);
    const data = await puppeteer.fetchStatistics();
    await puppeteer.close();
    data && await googleService.writeStatisticToSpreadsheet(data);
});

app.get('*', (req, res) => {
    res.sendFile(`${publicPath}/index.html`);
});

app.listen(7777, async () => {
    console.log(`The server is running on port 7777`);
    await googleService.connect();
});
