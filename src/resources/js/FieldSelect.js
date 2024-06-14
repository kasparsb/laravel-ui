import {q, qa, r, parent, on} from 'dom-helpers';

let FieldSelect = {
    onChangeValue(fieldSelectEl) {
        let isEmpty = true;

        let placeholderHTML = fieldSelectEl.dataset.placeholder;

        let selectedOption = q(fieldSelectEl, 'option:checked');
        if (selectedOption) {
            if (selectedOption.value) {
                placeholderHTML = selectedOption.innerHTML;
                isEmpty = false;
            }
        }

        if (isEmpty) {
            fieldSelectEl.dataset.isEmpty = '';
        }
        else {
            delete fieldSelectEl.dataset.isEmpty
        }

        r(fieldSelectEl).placeholder.innerHTML = placeholderHTML ? placeholderHTML : '';
    },
    init() {
        // Select
        qa('.field-select').forEach(fieldSelectEl => FieldSelect.onChangeValue(fieldSelectEl));

        on('change', '.field-select select', (ev, selectEl) => {
            this.onChangeValue(parent(selectEl, '[data-is-container]'))
        })
    }
}

export default FieldSelect;