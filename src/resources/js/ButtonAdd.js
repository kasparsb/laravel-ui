import {clickp} from 'dom-helpers';

export default {
    init() {
        clickp('[data-button-add]', (ev, el) => {
            switch (el.dataset.buttonAdd) {
                case 'tableRow':
                    window.webit.ui.Table.addRow(el.dataset.table);
                    break;
                case 'repeatableItem':
                    window.webit.ui.Repeatable.addItem(el);
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