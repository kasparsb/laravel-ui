import { clickp } from 'dom-helpers';
import Table from './Table';
import Repeatable from './Repeatable';

export default {
    init() {
        clickp('[data-button-add]', (ev, el) => {
            switch (el.dataset.buttonAdd) {
                case 'tableRow':
                    Table.addRow(el.dataset.table);
                    break;
                case 'repeatableItem':
                    Repeatable.addItem(el);
                    break;
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