import {click, change, qa, q, parent, addClass, removeClass} from 'dom-helpers';

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
        change('.radio-buttons [type="radio"]', (ev, inputEl) => {
            setCheckedAndUnchecked(parent(inputEl, '[data-is-container]'))
        })
    },

    update(inputRadioElOrRadioButtonsEl) {
        setCheckedAndUnchecked(parent(inputRadioElOrRadioButtonsEl, '.radio-buttons'));
    }
}