import isArray from './helpers/isArray';
import {q, click} from 'dom-helpers';

function loading(el) {
    // previous loading state
    el.dataset.pl = el.dataset.loading ? el.dataset.loading : '';
    el.dataset.loading = 'loading';
}

function idle(el) {
    if (!isArray(el)) {
        el = [el];
    }

    el.forEach(el => {
        /**
         * TODO ja padots fragment, tad vajadzētu meklē container elementu specifiskāk
         * nevis tikai pēc data-loading
         */
        if (el.nodeType && (el.nodeType == Node.DOCUMENT_FRAGMENT_NODE)) {
            el = q(el, '[data-loading="loading"]');
        }

        if (!(el instanceof Node)) {
            return;
        }

        if (el.dataset.pl) {
            el.dataset.loading = el.dataset.pl;
            delete el.dataset.pl;
        }
        else {
            delete el.dataset.loading;
        }
    })
}

function toggle(el) {
    if (el.dataset.loading == 'loading') {
        idle(el);
    }
    else {
        loading(el);
    }
}

export default {
    init() {
        click('button[data-loading="onclick"],a[data-loading="onclick"]', (ev, el) => {
            loading(el);
        })
    },
    toggle(el) {
        toggle(el)
    },
    loading(el) {
        loading(el)
    },
    idle(el) {
        idle(el)
    },
    maybeLoading(el, eventName) {
        if (el.dataset.loading == 'on'+eventName) {
            loading(el);
        }
    }
}