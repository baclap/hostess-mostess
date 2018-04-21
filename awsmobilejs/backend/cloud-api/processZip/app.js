'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

AWS.config.update({ region: process.env.REGION });

app.post('/process-zip', (req, res) => {
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('App started');
});

module.exports = app;
