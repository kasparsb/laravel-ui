import { clickp } from 'dom-helpers';
import Table from './Table';
import Repeatable from './Repeatable';

export default {
    init() {
        clickp('[data-button-add]', (ev, el) => {
            if (el.dataset.table) {
                Table.addRow(el.dataset.table);
            }
            else if (el.dataset.buttonAdd == 'repeatableItem') {
                Repeatable.addItem(el)
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