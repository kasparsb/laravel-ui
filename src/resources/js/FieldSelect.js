import {q, qa, r, parent, on} from 'dom-helpers';

let FieldSelect = {
    onChangeValue(selectEl) {
        r(parent(selectEl, '[data-is-container]')).placeholder.innerHTML = q(selectEl, 'option:checked').innerHTML;
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