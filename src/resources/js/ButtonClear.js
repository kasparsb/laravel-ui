import { clickp, parent } from 'dom-helpers';
import FieldDate from './FieldDate';

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
                FieldDate.clear(fieldDateEl);
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