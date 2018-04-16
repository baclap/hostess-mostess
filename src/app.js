import './style.css';
// looks like amplify assumes we'll transpile their code...
import Amplify, { API } from 'aws-amplify/dist/aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

const apiName = 'sampleCloudApi';
const path = '/items/test';
const myInit = {
    headers: {},
    response: true
};
API.get(apiName, path, myInit)
    .then(response => {
        console.log(response)
    })
    .catch(err => {
        console.error(err);
    });

function handleUploadClick() {
    const uploadFileInput = document.createElement('input');
    uploadFileInput.type = 'file';
    uploadFileInput.accept = '.zip';
    uploadFileInput.addEventListener('change', (event) => {
        console.log(event);
    });
    uploadFileInput.click();
}

const uploadButton = document.querySelector('.upload-file-button');
uploadButton.addEventListener('click', handleUploadClick);
