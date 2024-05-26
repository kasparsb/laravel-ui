import {r, parent, change, click, upload, append, remove, clone} from 'dom-helpers';


function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function getFileType(file) {
    let p = file.name.split('.');
    let extension = p[p.length-1];

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'svg':
        case 'tif':
        case 'tiff':
            return 'image';
        case 'zip':
        case 'bzip':
        case 'rar':
        case '7z':
        case 'gz':
        case 'tar':
        case 'bz2':
        case 'lz':
        case 'lz4':
            return 'archive';
        case 'pdf':
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'odt':
        case 'ods':
        case 'ots':
        case 'fods':
        case 'htm':
        case 'html':
            return 'document';
        case 'mp3':
        case 'm4a':
        case 'wav':
        case 'falc':
            return 'audio';
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'flv':
        case 'avchd':
            return 'audio';
        default:
            return 'document';
    }
}

function setFile(el) {
    let rel = r(el);

    for (let i = 0; i < rel.inputFile.files.length; i++) {

        let file = rel.inputFile.files[i];
        let fileEl = clone(rel.singleFileTemplate);
        delete fileEl.dataset.r;
        let rfileEl = r(fileEl);


        fileEl.dataset.fileType = getFileType(file);
        fileEl.dataset.state = 'ready';
        rfileEl.fileName.innerHTML = file.name
        rfileEl.fileDescription.innerHTML = humanFileSize(file.size)

        append(rel.files, fileEl);

        startUpload(fileEl, file, el.dataset.link);
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

function startUpload(el, file, uploadLink) {
    let rel = r(el);
    el.dataset.state = 'uploading';

    upload(uploadLink, file, {filename: file.name}, progress => {
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