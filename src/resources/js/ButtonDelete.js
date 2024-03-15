import request from 'dom-helpers/src/http/request';
import clickp from 'dom-helpers/src/event/clickp';

export default {
    init() {
        clickp('[data-role="button-delete"]', (ev, el) => {
            ev.preventDefault();
            if (el.dataset.url) {
                request('DELETE', el.dataset.url)
                    .then(r => window.location.href = el.dataset.redirect)
            }
        })
    }
}