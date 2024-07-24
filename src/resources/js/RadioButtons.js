import {click, qa, q, parent, addClass, removeClass} from 'dom-helpers';

function isButtonSelected(radioButtonEl) {
    return q(radioButtonEl, 'input').checked;
}

/**
 * Saliekam css klases pēc button state
 */
function setCheckedAndUnchecked(radioButtonsEl) {
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
            setTimeout(() => {
                setCheckedAndUnchecked(parent(radioButtonEl, '[data-is-container]'))
            }, 1);
        })
    },

    update(inputRadioElOrRadioButtonsEl) {
        setCheckedAndUnchecked(parent(inputRadioElOrRadioButtonsEl, '.radio-buttons'));
    }
}