import {
    q, r, parent, change, click, upload, append, remove, clone, replaceContent
} from 'dom-helpers';
import createImageFromFile from './createImageFromFile';
import AspectRatio from './AspectRatio';
import Form from './Form';


function humanFileSize(size) {
    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function getExtension(file) {
    let p = file.name.split('.');
    return p[p.length-1];
}

function getFileType(file) {
    /**
     * Šis jātur sync ar Modles\File file_type attribute
     */
    switch (getExtension(file)) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'svg':
        case 'tif':
        case 'tiff':
        case 'webp':
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
            return 'video';
        default:
            return 'document';
    }
}

function isImage(file) {
    if (file.type.substring(0, 6) === 'image/') {
        return true;
    }
}

function isVideo(file) {
    if (file.type.substring(0, 6) === 'video/') {
        return true;
    }
}

function isVisualMedia(file) {
    return isImage(file) || isVideo(file);
}

/**
 * Vizuāli izvadām input[type=file] izvēlētos failus
 */
function outputSelectedFiles(fileUploadEl) {
    fileUploadEl = r(fileUploadEl);

    let uploadPromises = [];

    // Izvēlētie faili
    for (let i = 0; i < fileUploadEl.inputFile.files.length; i++) {

        let file = fileUploadEl.inputFile.files[i];

        // Klonēja single file template
        let fileEl = r(clone(fileUploadEl.singleFileTemplate));
        delete fileEl.dataset.r;
        // Enable filename field, lai tas postējas
        fileEl.input.disabled = false;

        fileEl.dataset.fileType = getFileType(file);
        fileEl.dataset.state = 'ready';
        fileEl.fileName.innerHTML = file.name
        fileEl.fileDescription.innerHTML = humanFileSize(file.size)

        append(fileUploadEl.files, fileEl);

        uploadPromises.push(
            startFileUpload(fileEl, file, {
                delay: 400,
                uploadLink: fileUploadEl.dataset.link,
                valueField: fileUploadEl.dataset.valueField,
            })
        )
    }

    if (uploadPromises.length > 0) {
        if ('setFromBusyWhileUploading' in fileUploadEl.dataset) {

            Form.setBusy(parent(fileUploadEl, 'form'));

            Promise.allSettled(uploadPromises)
                .then((r) => {
                    console.log(r);
                    Form.setNotBusy(parent(fileUploadEl, 'form'));
                })
        }
    }

    // Tikko faili salikti noņemam state=empty
    fileUploadEl.inputFile.value = '';
    fileUploadEl.dataset.state = '';
}

function removeFile(fileEl) {
    let fileUploadEl = r(parent(fileEl, '[data-container="file-upload"]'));

    if ('previewImage' in fileEl.dataset) {
        fileEl.dataset.previewImage = '';
    }

    // Novācam file el
    remove(fileEl);

    // Pārbaudām vai ir kāds single file
    if (!q(fileUploadEl.files, '.file-upload-single-file')) {
        fileUploadEl.dataset.state = 'empty';
    }
}

function startFileUpload(fileEl, file, {delay, uploadLink, valueField}) {
    let preview = 'preview' in fileEl.dataset;

    if (preview) {
        fileEl.dataset.preview = 'ready';

        AspectRatio.setRatio(
            fileEl.preview,
            isVisualMedia(file) ? fileEl.dataset.previewAspectRatioDefaultVisualMedia : fileEl.dataset.previewAspectRatioDefault
        )

        if (isImage(file)) {
            // ieliekam preview no local bildes
            replaceContent(fileEl.preview.content, createImageFromFile(file, {
                data: {
                    r: 'image'
                }
            }));
        }
        else if (isVideo(file)) {

        }
        else {
            replaceContent(fileEl.preview.content, getFileType(file)+' (.'+getExtension(file)+')');
        }
    }

    /**
     * Upload
     */
    fileEl = r(fileEl);
    fileEl.dataset.state = 'uploading';

    let params = {
        value_field: valueField,
    };

    if (preview && isVisualMedia(file)) {
        params.return_url = true;
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            upload(
                uploadLink,
                file,
                params,
                // Progress callback
                progress => {
                    fileEl.indicator.style.width = progress+'%';
                    fileEl.progress.innerHTML = progress+'%';
                }
            )
                .then(response => {
                    fileEl.input.value = response.value;
                    fileEl.dataset.state = 'completed';

                    if (preview && isImage(file)) {
                        fileEl.preview.image.src = response.url;
                    }

                    resolve();
                })
                .catch(response => {
                    fileEl.dataset.state = 'failed';
                    fileEl.failedMessage.innerHTML = response.message;

                    reject();
                });
        }, delay)
    })
}

export default {
    init() {
        change('.file-upload [type=file]', (ev, el) => {
            outputSelectedFiles(parent(el, '[data-container]'));
        })
        click('.file-upload [data-r="button-remove"]', (ev, el) => {
            removeFile(parent(el, '[data-container]'));
        })
    },
}