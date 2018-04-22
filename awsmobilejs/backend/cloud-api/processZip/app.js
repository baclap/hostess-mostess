'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const extract = require('extract-zip');
const path = require('path');
const fs = require('fs');

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
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const CONTENT_TYPE_MAP = {
    html: 'text/html',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    png: 'image/png',
    css: 'text/css'
};

app.post('/process-zip', (req, res) => {
    console.log('URL:', req.url);
    console.log('Body:', req.body);

    const args = {
        Bucket: 'hostessmostess-userfiles-mobilehub-1526602926/public',
        Key: req.body.key
    };
    s3.getObject(args, (err, data) => {
        if (err) {
            console.error('Error getting S3 Object.', err.message);
            res.status(500);
            return res.json({ success: false });
        }
        console.log('Test Data:', data);

        if (fs.existsSync('/tmp/zip')) {
            fs.rmdirSync('/tmp/zip');
        }
        if (fs.existsSync('/tmp/files')) {
            fs.rmdirSync('/tmp/files');
        }
        fs.mkdirSync('/tmp/zip');
        fs.mkdirSync('/tmp/files');
        fs.writeFileSync('/tmp/zip/files.zip', data.Body);

        const tempDir = '/tmp/files';
        extract('/tmp/zip/files.zip', { dir: '/tmp/files' }, (err) => {
            if (err) {
                console.error('Error extracting zip.', err.message);
                res.status(500);
                return res.json({ success: false });
            }
            const zipFiles = fs.readdirSync('/tmp/files');
            console.log('Zip Files:', JSON.stringify(zipFiles, null, 2));
            const dirName = zipFiles[0];
            const files = fs.readdirSync(`/tmp/files/${dirName}`);
            console.log('Dir Files:', JSON.stringify(files, null, 2));

            const uploadToS3 = file => new Promise((resolve, reject) => {
                const extension = file.split('.').pop();
                const args = {
                    Bucket: `hostess-mostess-uploads/${dirName}`,
                    Key: file,
                    ContentType: CONTENT_TYPE_MAP[extension],
                    Body: fs.readFileSync(`/tmp/files/${dirName}/${file}`)
                };
                s3.putObject(args, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });

            Promise.all(files.map(uploadToS3))
                .then(() => {
                    console.log('UPLOAD SUCCESS');
                    res.json({ success: true });
                })
                .catch(err => {
                    console.error('S3 Upload Failed.', err.message);
                    res.status(500);
                    return res.json({ success: false });
                });
        });

    });

});

app.listen(3000, () => {
    console.log('App started');
});

module.exports = app;
