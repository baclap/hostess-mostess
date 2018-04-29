// default exported Amplify code is not transpiled, so grab from dist
import Amplify, { API, Storage } from 'aws-amplify/dist/aws-amplify';
import aws_exports from '../aws-exports';
import mdl from './mdl';

Amplify.configure(aws_exports);

const uploadButton = document.querySelector('.upload-file-button');
let uploadFileInput;

const modalBackground = document.querySelector('.modal-background');
const uploadModal = document.querySelector('.uploading-modal');
const successModal = document.querySelector('.success-modal');
const errorModal = document.querySelector('.error-modal');

function refreshUploadFileInput() {
    if (uploadFileInput) {
        uploadFileInput.removeEventListener('change', handleUploadFileInputChange);
    }
    uploadFileInput = document.createElement('input');
    uploadFileInput.type = 'file';
    uploadFileInput.accept = '.zip';
    uploadFileInput.addEventListener('change', handleUploadFileInputChange);
}

function handleUploadButtonClick() {
    uploadFileInput.click();
}

function handleUploadFileInputChange(event) {
    refreshUploadFileInput();
    const slug = prompt('Enter URL slug');
    const file = event.target.files[0];
    console.log('Slug:', slug);
    console.log('File:', file);

    if (!slug) {
        return alert('You must enter a slug');
    }
    if (!file || file.name.split('.').pop() !== 'zip') {
        return alert('You must upload a .zip file');
    }

    mdl.show(modalBackground);
    mdl.show(uploadModal);

    Storage.put(`upload_${Date.now()}.zip`, file)
        .then(({ key }) => {
            console.log('Key:', key);
            const init = {
                headers: {},
                body: { slug, key },
                response: true
            };
            return API.post('processZip', '/process-zip', init);
        })
        .then(res => {
            console.log('Lambda Response:', res);
            if (!res.data.success) {
                throw new Error(res.data.error || 'Upload failed!');
            }
            const url = res.data.url;
            const linkHTML = `<a href="${url}">${url}</a>`;
            console.log('URL:', url);
            mdl.addMessage(successModal, linkHTML);
            mdl.hide(uploadModal);
            mdl.show(successModal);
            modalBackground.addEventListener('click', handleModalBackgroundClick);
        })
        .catch(err => {
            console.error('Error:', err);
            mdl.addMessage(errorModal, err.message);
            mdl.hide(uploadModal);
            mdl.show(errorModal);
            modalBackground.addEventListener('click', handleModalBackgroundClick);
        });
}

function handleModalBackgroundClick() {
    mdl.hideCurrentlyVisible();
    mdl.hide(modalBackground);
    modalBackground.removeEventListener('click', handleModalBackgroundClick);
}

refreshUploadFileInput();
uploadButton.addEventListener('click', handleUploadButtonClick);
