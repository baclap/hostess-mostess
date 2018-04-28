'use strict';

// Born: Sun, Apr 23 12:00 AM PST

const CONTENT_TYPE_MAP = {
    html: 'text/html',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    png: 'image/png',
    css: 'text/css'
};

class PromiseS3 {
    constructor(s3) {
        this._s3 = s3;
    }
    fetch({ Bucket, Key }) {
        return new Promise((resolve, reject) => {
            this._s3.getObject({ Bucket, Key }, (err, data) => {
                if (err) {
                    console.error('S3_FETCH_FAILED:', err.message);
                    return reject(err);
                }
                resolve(data.Body);
            });
        });
    }
    put({ Bucket, Key, file }) {
        return new Promise((resolve, reject) => {
            const extension = Key.split('.').pop();
            const args = {
                Bucket,
                Key,
                ContentType: CONTENT_TYPE_MAP[extension],
                Body: file
            };
            this._s3.putObject(args, (err, data) => {
                if (err) {
                    console.error('S3_PUT_FAILED:', err.message);
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = PromiseS3;
