import './style.css';
// looks like amplify assumes we'll transpile their code...
import Amplify, { API, Storage } from 'aws-amplify/dist/aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

// const file = event.target.files[0];
// console.log('File:', file);
// Storage.put(file.name, file)
//     .then (res => {
//         console.log('S3 Response:', res);
//         const init = {
//             headers: {},
//             body: { key: res.key },
//             response: true
//         }
//         return API.post('processZip', '/process-zip', init)
//             .then(res => {
//                 console.log('Lambda Response:', res)
//             });
//     })
//     .catch(err => console.log(err));

function handleUploadClick() {
    const uploadFileInput = document.createElement('input');
    uploadFileInput.type = 'file';
    uploadFileInput.accept = '.zip';
    uploadFileInput.addEventListener('change', (event) => {
        console.log(event);
        modalBackground.classList.toggle('hidden');
        uploadModal.classList.toggle('hidden');
    });
    uploadFileInput.click();
}

const uploadButton = document.querySelector('.upload-file-button');
uploadButton.addEventListener('click', handleUploadClick);

const modalBackground = document.querySelector('.modal-background');
const uploadModal = document.querySelector('.uploading-modal');
const successModal = document.querySelector('.success-modal');
const errorModal = document.querySelector('.error-modal');
