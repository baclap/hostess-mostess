'use strict';

const path = require('path');
const fs = require('fs');
const extract = require('extract-zip');

// fs helpers (fish)
module.exports = {
    clean(dirPath) {
        try {
            if (fs.existsSync(dirPath)) {
                // https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
                function deleteFolderRecursive(path) {
                    fs.readdirSync(path).forEach(file => {
                        var curPath = `${path}/${file}`;
                        if (fs.lstatSync(curPath).isDirectory()) { // recurse
                            deleteFolderRecursive(curPath);
                        } else { // delete file
                            fs.unlinkSync(curPath);
                        }
                    });
                    fs.rmdirSync(path);
                }
                deleteFolderRecursive(dirPath);
            }
            fs.mkdirSync(dirPath);
        } catch (err) {
            console.error('DIR_CLEANUP_FAILED:', err.message);
            throw err;
        }
    },
    place(filePath, file) {
        try {
            fs.writeFileSync(filePath, file);
        } catch (err) {
            console.error('PLACE_FILE_FAILED:', err.message);
            throw err;
        }
    },
    extract({ from, to }) {
        return new Promise((resolve, reject) => {
            extract(from, { dir: to }, (err) => {
                if (err) {
                    console.error('ZIP_EXTRACT_FAILED:', err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    },
    readDir(dir) {
        try {
            return fs.readdirSync(dir);
        } catch (err) {
            console.error('DIR_READ_FAILED:', err.message);
            throw err;
        }

    },
    readFile(dir) {
        try {
            return fs.readFileSync(dir);
        } catch (err) {
            console.error('FILE_READ_FAILED:', err.message);
            throw err;
        }

    }
};
