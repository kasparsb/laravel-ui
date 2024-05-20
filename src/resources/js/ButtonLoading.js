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

export default {
    init() {
        click('button[data-loading="onclick"],a[data-loading="onclick"]', (ev, el) => {
            console.log(el);
            loading(el);
        })
    },
    loading(el) {
        loading(el)
    },
    idle(el) {
        idle(el)
    }
}