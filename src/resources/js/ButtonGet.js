import {get, clickp} from 'dom-helpers';
import ButtonLoading from './ButtonLoading';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';

export default {
    init() {
        clickp('[data-button-get]', (ev, el) => {
            if (el.dataset.url) {

                ButtonLoading.maybeLoading(el, 'get');

                let elReplacer = new ReplaceElWithNewHtmlIfNecessary(el);

                get(el.dataset.url)
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
    isButtonget(el) {
        if ('buttonGet' in el.dataset) {
            return true;
        }
        return false;
    }
}