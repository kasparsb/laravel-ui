import {q, qa, on, change, parent} from 'dom-helpers'

function updateValue(fieldEl) {
    let incrementFields = [...qa(fieldEl, '.field-increment input')];
    q(fieldEl, 'input[type=hidden]').value =
        incrementFields.at(0).value
        + ':'
        + incrementFields.at(1).value;
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
    }
}