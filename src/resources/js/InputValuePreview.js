import {q, parent} from 'dom-helpers';

/**
 * Padot var vai nu .input-value-preview vai arī kādu no child elementiem
 */
function setPlaceholder(childOrfieldEl, placeholder) {

    let fieldEl = parent(childOrfieldEl, '.input-value-preview')

    let isEmpty = placeholder.trim() ? false : true;
    let placeholderHTML = placeholder;

    // vajadzīgs priekš css, lai var nostilot tukšo vērtību (placeholder)
    if (isEmpty) {
        fieldEl.dataset.isEmpty = '';
    }
    else {
        delete fieldEl.dataset.isEmpty
    }

    q(fieldEl, '[data-input-value-preview-placeholder]').innerHTML = placeholderHTML;
}

export default {
    setPlaceholder(childOrfieldEl, placeholder) {
        setPlaceholder(childOrfieldEl, placeholder)
    }
}