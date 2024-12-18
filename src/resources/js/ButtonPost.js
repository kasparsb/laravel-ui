import {post, clickp} from 'dom-helpers';
import ButtonLoading from './ButtonLoading';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';

export default {
    init() {
        clickp('[data-button-post]', (ev, el) => {
            if (el.dataset.url) {

                ButtonLoading.maybeLoading(el, 'post');

                let elReplacer = new ReplaceElWithNewHtmlIfNecessary(el);

                post(el.dataset.url)
                    .then(r => {
                        if (el.dataset.redirect) {
                            window.location.href = el.dataset.redirect
                        }
                        else {
                            elReplacer.replace(r)
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