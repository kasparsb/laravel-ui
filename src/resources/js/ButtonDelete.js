import request from 'dom-helpers/src/http/request';
import clickp from 'dom-helpers/src/event/clickp';
import ButtonLoading from './ButtonLoading';

export default {
    init() {
        clickp('[data-buttondelete]', (ev, el) => {
            ev.preventDefault();
            if (el.dataset.url) {

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