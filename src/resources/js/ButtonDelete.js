import request from 'dom-helpers/src/http/request';
import clickp from 'dom-helpers/src/event/clickp';

export default {
    init() {
        clickp('[data-buttondelete]', (ev, el) => {
            ev.preventDefault();
            if (el.dataset.url) {
                request('DELETE', el.dataset.url)
                    .then(r => window.location.href = el.dataset.redirect)
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