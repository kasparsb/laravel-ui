import {q, qa, on, change, parent} from 'dom-helpers'

function updateValue(fieldEl, value) {
    if (typeof value == 'undefined') {
        let incrementFields = [...qa(fieldEl, '.field-increment input')];
        value = incrementFields.at(0).value
            + ':'
            + incrementFields.at(1).value;
    }

    q(fieldEl, 'input[type=hidden]').value = value
}

function displayValue(fieldEl) {
    let value = q(fieldEl, 'input[type=hidden]').value;
    if (!value) {
        value = '';
    }
    let p = value.split(':');
    let incrementFields = [...qa(fieldEl, '.field-increment input')];
    if (p.length > 0) {
        incrementFields.at(0).value = p[0];
    }
    if (p.length > 1) {
        incrementFields.at(1).value = p[1];
    }
}

export default {
    init() {
        change('.field-hours-minutes .field-increment input', (ev, el) => {
            updateValue(parent(el, '.field-hours-minutes'));
        })

        let t = 0;
        on('keyup', '.field-hours-minutes .field-increment input', (ev, el) => {
            clearTimeout(t);
            t = setTimeout(() => {
                updateValue(parent(el, '.field-hours-minutes'));
            }, 200)
        })
    },

    setValue(fieldElOrInputEl, value) {
        let fieldEl = parent(fieldElOrInputEl, '.field-hours-minutes');
        updateValue(fieldEl, value);
        displayValue(fieldEl);
    }
}