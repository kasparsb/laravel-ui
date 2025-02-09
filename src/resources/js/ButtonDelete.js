import {parent, del, clickp} from 'dom-helpers'
import ButtonLoading from './ButtonLoading';
import Table from './Table';
import DropdownMenu from './DropdownMenu';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';
import handleDropdownMenuHideFromEl from './helpers/handleDropdownMenuHideFromEl';

export default {
    init() {
        clickp('[data-button-delete]', (ev, buttonEl) => {
            ev.preventDefault();

            // Tabulas rindas dzēšana
            if (buttonEl.dataset.buttonDelete == 'tableRow') {
                if (buttonEl.dataset.role == 'menuitem') {
                    // Dzēšam
                    Table.deleteRow(
                        // Atrodam tabula row
                        parent(
                            // Atrodam menu open trigger elementu. Tā būs poga tabulas šūnā
                            DropdownMenu.getOpenTriggerByChild(buttonEl)
                            , 'tr'
                        )
                    );
                    DropdownMenu.close();
                }
                else {
                    // Dzēšam to rindu, kurā atrodas delete poga
                    Table.deleteRow(parent(buttonEl, 'tr'));
                }
            }
            else if (buttonEl.dataset.url) {
                ButtonLoading.maybeLoading(buttonEl, 'delete');

                let elReplacer = new ReplaceElWithNewHtmlIfNecessary(buttonEl);

                /**
                 * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
                 * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
                 */
                handleDropdownMenuHideFromEl(buttonEl, 'onsubmit');

                del(buttonEl.dataset.url)
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
     * Pārbauda vai padotais el ir delete button
     */
    isButtonDelete(buttonEl) {
        if ('buttonDelete' in buttonEl.dataset) {
            return true;
        }
        return false;
    }
}