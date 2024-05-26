import {r, parent, change, click, upload, append, remove, clone} from 'dom-helpers';


function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function setFile(el) {
    let rel = r(el);

    for (let i = 0; i < rel.inputFile.files.length; i++) {

        let file = rel.inputFile.files[i];
        let fileEl = clone(rel.singleFileTemplate);
        delete fileEl.dataset.r;
        let rfileEl = r(fileEl);

        fileEl.dataset.state = 'ready';
        rfileEl.fileName.innerHTML = file.name
        rfileEl.fileDescription.innerHTML = humanFileSize(file.size)

        append(rel.files, fileEl);

        startUpload(fileEl, file);
    }

    rel.inputFile.value = '';

    el.dataset.state = 'uploading';
}

function removeFile(el) {
    let upload = parent(el, '[data-container="file-upload"]');
    // Novācam file el
    remove(el);

    // Pārbaudām vai ir palikuši faili
    if (!r(upload).files.hasChildNodes()) {
        upload.dataset.state = 'empty';
    }
}

function startUpload(el, file) {
    let rel = r(el);
    el.dataset.state = 'uploading';

    upload('/fileupload', file, {filename: file.name}, progress => {
        rel.indicator.style.width = progress+'%';
        rel.progress.innerHTML = progress+'%';
    })
        .then(response => {
            rel.input.value = response.filename;
            el.dataset.state = 'completed';
        })
        .catch(response => {
            el.dataset.state = 'failed';
            rel.failedMessage.innerHTML = response.message;
            // console.log(response);
        });
}

export default {
    init() {
        change('.file-upload [type=file]', (ev, el) => {
            setFile(parent(el, '[data-container]'));
        })
        click('.file-upload [data-r="button-remove"]', (ev, el) => {
            removeFile(parent(el, '[data-container]'));
        })
    },

}