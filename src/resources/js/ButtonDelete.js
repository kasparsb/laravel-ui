import {parent, del, clickp} from 'dom-helpers'
import ButtonLoading from './ButtonLoading';
import Table from './Table';
import DropdownMenu from './DropdownMenu';

export default {
    init() {
        clickp('[data-button-delete]', (ev, el) => {
            ev.preventDefault();

            // Tabulas rindas dzēšana
            if (el.dataset.buttonDelete == 'tableRow') {
                if (el.dataset.role == 'menuitem') {
                    // Jāatrod click trigger
                    Table.deleteRow(parent(DropdownMenu.findClickTrigger(), 'tr'));
                    DropdownMenu.close();
                }
                else {
                    // Dzēšam to rindu, kurā atrodas delete poga
                    Table.deleteRow(parent(el, 'tr'));
                }
            }
            else if (el.dataset.url) {
                ButtonLoading.maybeLoading(el, 'delete');

                del(el.dataset.url)
                    .then(r => {
                        if (el.dataset.redirect) {
                            window.location.href = el.dataset.redirect
                        }
                        else {
                            ButtonLoading.idle(el);
                        }
                    })
            }
        })
    },
    /**
     * Pārbauda vai padotais el ir delete button
     */
    isButtonDelete(el) {
        if ('buttonDelete' in el.dataset) {
            return true;
        }
        return false;
    }
}