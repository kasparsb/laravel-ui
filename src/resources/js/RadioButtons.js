import {click, qa, r, parent, addClass, removeClass} from 'dom-helpers';

function isButtonSelected(radioButtonEl) {
    return r(radioButtonEl).radio.checked;
}

function handleRadioButtonClick(radioButtonEl) {
    let radioButtonsEl = parent(radioButtonEl, '[data-container]');

    // saliekam css klases pēc button state
    qa(radioButtonsEl, '[data-role="radio-button"]').forEach(el => {
        console.log(el, isButtonSelected(el));
        if (isButtonSelected(el)) {
            addClass(el, el.dataset.classSelected)
            removeClass(el, el.dataset.class)
        }
        else {
            addClass(el, el.dataset.class)
            removeClass(el, el.dataset.classSelected)
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