import {ce} from 'dom-helpers'

function createImageFromFile(file, attrs) {
    if (typeof attrs == 'undefined') {
        attrs = {}
    }
    attrs.src = URL.createObjectURL(file);
    return ce('img', attrs)
}

export default createImageFromFile