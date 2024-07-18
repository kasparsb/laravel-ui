import {click, qa, q, parent, addClass, removeClass} from 'dom-helpers';

function isButtonSelected(radioButtonEl) {
    return q(radioButtonEl, 'input').checked;
}

function handleRadioButtonClick(radioButtonEl) {
    let radioButtonsEl = parent(radioButtonEl, '[data-is-container]');

    // saliekam css klases pēc button state
    qa(radioButtonsEl, '[data-role="radio-button"]').forEach(el => {
        if (isButtonSelected(el)) {
            removeClass(el, el.dataset.class)
            addClass(el, el.dataset.classSelected)
        }
        else {
            removeClass(el, el.dataset.classSelected)
            addClass(el, el.dataset.class)
        }
    })
}

export default {
    init() {
        click('.radio-buttons [data-role="radio-button"]', (ev, radioButtonEl) => {
            setTimeout(() => handleRadioButtonClick(radioButtonEl), 1);
        })
    }
}