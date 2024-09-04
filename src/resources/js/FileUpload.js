import {
    qa, r, parent, change, click, upload, append, remove, clone, replaceContent
} from 'dom-helpers';
import getImageDimensionsFromFile from './getImageDimensionsFromFile';
import createImageFromFile from './createImageFromFile';
import AspectRatio from './AspectRatio';


function humanFileSize(size) {
    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function getFileType(file) {
    let p = file.name.split('.');
    let extension = p[p.length-1];

    /**
     * Šis jātur sync ar Modles\File file_type attribute
     */
    switch (extension) {
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
            return 'audio';
        default:
            return 'document';
    }
}

function setFile(fileUploadEl) {
    fileUploadEl = r(fileUploadEl);

    for (let i = 0; i < fileUploadEl.inputFile.files.length; i++) {

        let file = fileUploadEl.inputFile.files[i];

        let fileEl = r(clone(fileUploadEl.singleFileTemplate));
        delete fileEl.dataset.r;
        // Enable filename field, lai tas postējas
        fileEl.input.disabled = false;

        fileEl.dataset.fileType = getFileType(file);
        fileEl.dataset.state = 'ready';
        fileEl.fileName.innerHTML = file.name
        fileEl.fileDescription.innerHTML = humanFileSize(file.size)

        append(fileUploadEl.files, fileEl);

        startFileUpload(fileEl, file, {
            uploadLink: fileUploadEl.dataset.link,
            valueField: fileUploadEl.dataset.valueField,
        });
    }

    fileUploadEl.inputFile.value = '';
    fileUploadEl.dataset.state = 'uploading';
}

function removeFile(fileEl) {
    let fileUploadEl = r(parent(fileEl, '[data-container="file-upload"]'));

    if ('previewImage' in fileEl.dataset) {
        fileEl.dataset.previewImage = '';
    }

    // Novācam file el
    remove(fileEl);

    // Pārbaudām vai ir palikuši faili
    if (!fileUploadEl.files.hasChildNodes()) {
        fileUploadEl.dataset.state = 'empty';
    }
}

function startFileUpload(fileEl, file, {uploadLink, valueField}) {
    let previewImage = 'previewImage' in fileEl.dataset;

    if (previewImage) {
        // make sure its image
        if (file.type.substring(0, 6) !== 'image/') {
            previewImage = false;
        }
    }

    // liekam pazīmi, ka previewImage tiešām būs
    if (previewImage) {
        fileEl.dataset.previewImage = 'ready';
    }

    /**
     * Image preview
     */
    if (previewImage) {
        // Ielādējam image dimensions
        getImageDimensionsFromFile(file)
            .then(imageDimensions => {
                // uzliek atbilstošo aspect ratio
                AspectRatio.setRatioFromDimensions(fileEl.preview, imageDimensions)

                // ieliekam preview no local bildes
                replaceContent(fileEl.preview.content, createImageFromFile(file, {
                    data: {
                        r: 'image'
                    }
                }));
            });
    }

    /**
     * Upload
     */
    fileEl = r(fileEl);
    fileEl.dataset.state = 'uploading';

    let params = {
        value_field: valueField,
    };

    if (previewImage) {
        params.return_url = true;
    }

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

            if (previewImage) {
                fileEl.preview.image.src = response.url;
            }
        })
        .catch(response => {

            console.log(response);

            fileEl.dataset.state = 'failed';
            fileEl.failedMessage.innerHTML = response.message;
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

        // Single file template input file disable. So they do not post
        qa('.file-upload').forEach(el => {
            // šajā laukā glabāsies uploaded filename
            r(el).singleFileTemplate.input.disabled = true;
        })
    },
}