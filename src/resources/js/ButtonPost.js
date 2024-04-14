import post from 'dom-helpers/src/http/post';
import clickp from 'dom-helpers/src/event/clickp';

export default {
    init() {
        clickp('[data-buttonpost]', (ev, el) => {
            console.log('asdad post', el.dataset.url);
            ev.preventDefault();
            if (el.dataset.url) {
                post(el.dataset.url)
                    .then(r => {
                        if (el.dataset.redirect) {
                            window.location.href = el.dataset.redirect
                        }
                    })
            }
        })
    },
    /**
     * Pārbauda vai padotais el ir post button
     */
    isButtonPost(el) {
        if ('buttonpost' in el.dataset) {
            return true;
        }
        return false;
    }
}