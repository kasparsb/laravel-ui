import {get, clickp} from 'dom-helpers';
import ButtonLoading from './ButtonLoading';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';
import handleDropdownMenuHideFromEl from './helpers/handleDropdownMenuHideFromEl';

export default {
    init() {
        clickp('[data-button-get]', (ev, buttonEl) => {
            if (buttonEl.dataset.url) {

                ButtonLoading.maybeLoading(buttonEl, 'get');

                let elReplacer = new ReplaceElWithNewHtmlIfNecessary(buttonEl);

                /**
                 * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
                 * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
                 */
                handleDropdownMenuHideFromEl(buttonEl, 'onsubmit');

                get(buttonEl.dataset.url)
                    .then(r => {
                        if (buttonEl.dataset.redirect) {
                            window.location.href = buttonEl.dataset.redirect
                        }
                        else {
                            elReplacer.replace(r)
                            ButtonLoading.idle(buttonEl);
                            handleDropdownMenuHideFromEl(buttonEl, 'aftersubmit');
                        }
                    })
            }
        })
    },
    /**
     * Pārbauda vai padotais el ir post button
     */
    isButtonget(buttonEl) {
        if ('buttonGet' in buttonEl.dataset) {
            return true;
        }
        return false;
    }
}