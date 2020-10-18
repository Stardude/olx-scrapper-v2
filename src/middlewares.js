const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '..', 'public');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
};

module.exports.loadStatic = app => {
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
        res.sendFile(`${publicPath}/index.html`);
    });
};
