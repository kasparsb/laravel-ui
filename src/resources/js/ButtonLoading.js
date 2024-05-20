import {click} from 'dom-helpers';

function loading(el) {
    // previous loading state
    el.dataset.pl = el.dataset.loading ? el.dataset.loading : '';
    el.dataset.loading = 'loading';

    // previous disabled state
    el.dataset.pd = el.disabled ? 'disabled' : '';
    el.disabled = true;
}

function idle(el) {
    if (el.dataset.pl) {
        el.dataset.loading = el.dataset.pl;
    }
    else {
        delete el.dataset.loading;
    }
    delete el.dataset.pl;

    el.disabled = el.dataset.pd == 'disabled';
    delete el.dataset.pd;
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