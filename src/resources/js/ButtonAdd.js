import { clickp } from 'dom-helpers';
import Table from './Table';

export default {
    init() {
        clickp('[data-button-add]', (ev, el) => {
            if (el.dataset.table) {
                Table.addRow(el.dataset.table);
            }
        })
    },
    /**
     * Pārbauda vai padotais el ir post button
     */
    isButtonAdd(el) {
        if ('buttonAdd' in el.dataset) {
            return true;
        }
        return false;
    }
}