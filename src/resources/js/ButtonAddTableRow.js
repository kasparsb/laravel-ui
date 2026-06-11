import {q, clickp} from 'dom-helpers';

/**
 * Add table row on click
 */
export default {
    init() {
        clickp('[data-button-add-table-row]', (ev, el) => {
            ev.preventDefault();
            if (el.dataset.buttonAddTableRow) {
                window.webit.ui.Table.addRow(q(`table[data-name=${el.dataset.buttonAddTableRow}]`));
            }
        })
    },
}