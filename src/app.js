import './style.css';
// looks like amplify assumes we'll transpile their code...
import Amplify, { API, Storage } from 'aws-amplify/dist/aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

// const slug = document.querySelector('#slug-input').value;
// if (!slug) {
//     return alert('You must enter a slug');
// }
// const file = event.target.files[0];
// console.log('Slug:', slug);
// console.log('File:', file);
// if (file.name.split('.').pop() !== 'zip') {
//     return alert('You must upload a .zip file');
// }
// Storage.put(`upload_${Date.now()}.zip`, file)
//     .then (({ key }) => {
//         console.log('Key:', key);
//         const init = {
//             headers: {},
//             body: { slug, key },
//             response: true
//         };
//         return API.post('processZip', '/process-zip', init);
//     })
//     .then(res => {
//         console.log('Lambda Response:', res);
//         const a = document.createElement('a');
//         const url = `http://hostessmostess-static.s3-website-us-east-1.amazonaws.com/${res.data.slug}/`;
//         a.setAttribute('href', url);
//         a.textContent = url;
//         document.body.appendChild(a);
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
