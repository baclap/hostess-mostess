'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const fish = require('./lib/fish');
const PromiseS3 = require('./lib/PromiseS3');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const { REGION, ZIP_BUCKET, HOST_BUCKET } = process.env;

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: REGION
});
const ps3 = new PromiseS3(s3);

app.post('/process-zip', (req, res) => {
    const { key, slug } = req.body;
    console.log(`Retrieving "${key}" from "${ZIP_BUCKET}"...`)
    Promise.resolve()
        .then(() => {
            if (key.split('.').pop() !== 'zip') {
                throw new Error('Invalid file format');
            }
        })
        .then(() => ps3.fetch({ Bucket: ZIP_BUCKET, Key: key }))
        .then(zipFile => {
            console.log('zipFile:', JSON.stringify(zipFile, null, 2));
            console.log('Cleaning tmp...');
            fish.clean('/tmp/zip');
            fish.clean('/tmp/src');
            console.log('Placing zip...');
            fish.place('/tmp/zip/project.zip', zipFile);
            console.log('Extracting zip...');
            return fish.extract({ from: '/tmp/zip/project.zip', to: '/tmp/project' });
        })
        .then(() => {
            console.log('Reading project dir...');
            const projectDirContent = fish.readDir('/tmp/project');
            console.log('projectDirContent:', JSON.stringify(projectDirContent, null, 2));
            const src = projectDirContent[0];
            console.log('Reading src dir...');
            const srcFileNames = fish.readDir(`/tmp/project/${src}`);
            return Promise.all(
                srcFileNames.map(fileName => ps3.put({
                    Bucket: HOST_BUCKET,
                    Key: `${slug}/${fileName}`,
                    file: fish.readFile(`/tmp/project/${src}/${fileName}`)
                }))
            );
        })
        .then(() => {
            return res.json({ success: true });
        })
        .catch(err => {
            console.error('EXECUTION_FAILURE');
            console.error(err.stack);
            res.status(500);
            return res.json({ success: false });
        });
});

app.listen(3000, () => {
    console.log('App started');
});

module.exports = app;
