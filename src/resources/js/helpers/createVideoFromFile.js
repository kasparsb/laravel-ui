import {ce} from 'dom-helpers'

function createVideoFromFile(file, attrs) {
    if (typeof attrs == 'undefined') {
        attrs = {}
    }
    attrs.controls = '';
    attrs.src = URL.createObjectURL(file);
    return ce('video', attrs)
}

export default createVideoFromFile