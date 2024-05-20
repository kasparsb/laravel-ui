import post from 'dom-helpers/src/http/post';
import clickp from 'dom-helpers/src/event/clickp';
import ButtonLoading from './ButtonLoading';

export default {
    init() {
        clickp('[data-buttonpost]', (ev, el) => {
            ev.preventDefault();
            if (el.dataset.url) {

                ButtonLoading.maybeLoading(el, 'post');

                post(el.dataset.url)
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
     * Pārbauda vai padotais el ir post button
     */
    isButtonPost(el) {
        if ('buttonpost' in el.dataset) {
            return true;
        }
        return false;
    }
}