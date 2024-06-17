import { post, clickp } from 'dom-helpers';
import ButtonLoading from './ButtonLoading';

export default {
    init() {
        clickp('[data-button-post]', (ev, el) => {
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
        if ('buttonPost' in el.dataset) {
            return true;
        }
        return false;
    }
}