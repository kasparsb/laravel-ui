import {q, parent} from 'dom-helpers';

/**
 * Padot var vai nu .input-value-preview vai arī kādu no child elementiem
 */
function setPlaceholder(childOrfieldEl, placeholder) {

    let fieldEl = parent(childOrfieldEl, '.input-value-preview')
    if (!fieldEl) {
        return;
    }

    let isEmpty = placeholder.trim() ? false : true;

    // vajadzīgs priekš css, lai var nostilot tukšo vērtību (placeholder)
    if (isEmpty) {
        fieldEl.dataset.isEmpty = '';

        placeholder = fieldEl.dataset.placeholder;
    }
    else {
        delete fieldEl.dataset.isEmpty
    }

    q(fieldEl, '[data-input-value-preview-placeholder]').innerHTML = placeholder;
}

export default {
    setPlaceholder(childOrfieldEl, placeholder) {
        setPlaceholder(childOrfieldEl, placeholder)
    }
}