import { clickp, parent } from 'dom-helpers';

export default {
    init() {
        clickp('[data-button-clear]', (ev, buttonEl) => {

            /**
             * TODO šis vēl izstrādē
             * pašlaik uztaisīt, tikai, lai darbotos uz field-date
             *
             * el.dataset.buttonClear būtu query selector, lai atrastu lauku kuru notīrīt
             */

            let fieldDateEl = parent(buttonEl, '.field-date');
            if (fieldDateEl) {
                // Late resolve. Tikai ja ir pieejams FieldDate
                if (window.webit.ui.FieldDate) {
                    window.webit.ui.FieldDate.clear(fieldDateEl);
                }
            }
        })
    },
    isButtonClear(el) {
        if ('buttonClear' in el.dataset) {
            return true;
        }
        return false;
    }
}