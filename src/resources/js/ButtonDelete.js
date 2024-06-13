import {parent, request, clickp} from 'dom-helpers'
import ButtonLoading from './ButtonLoading';
import Table from './Table';
import DropdownMenu from './DropdownMenu';

export default {
    init() {
        clickp('[data-buttondelete]', (ev, el) => {
            ev.preventDefault();

            // Tabulas rindas dzēšana
            if (el.dataset.buttondelete == 'tableRow') {
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

                request('DELETE', el.dataset.url)
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
        if ('buttondelete' in el.dataset) {
            return true;
        }
        return false;
    }
}