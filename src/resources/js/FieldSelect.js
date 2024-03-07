import {qa, q, parent, on} from 'dom-helpers';

let FieldSelect = {
    onChangeValue(selectEl) {
        let container = parent(selectEl, '[data-is-container]');
        if (container) {
            q(container, '[data-value-text]').innerHTML = q(selectEl, 'option:checked').innerHTML
        }
    },
    setEvents() {
        on('change', '.field-select select', (ev, selectEl) => {
            this.onChangeValue(selectEl)
        })
    },
    init() {
        // Select
        qa('.field-select').forEach(el => FieldSelect.onChangeValue(q(el, 'select')));

        this.setEvents();
    }
}

export default FieldSelect;