import {click} from 'dom-helpers';

function loading(el) {
    // previous loading state
    el.dataset.pl = el.dataset.loading ? el.dataset.loading : '';
    el.dataset.loading = 'loading';

    // previous disabled state
    //el.dataset.pd = el.disabled ? 'disabled' : '';

    /**
     * Ja nav timeout, tad submit nenotiek, jo acīmredzot disabled pogas nesubmitējas,
     * ja arī bija not disabled
     *
     * Ja poga ir Dropdown, tad uz disable poga zaudē fokusu un Dropdown menu
     * nostrādā focusout un Dropdown menu aizveras, tad kad to nevajag darīt
     *
     * Disabled, tagad ir radījis divas problēmas. Varbūt labāk netaisīt disable,
     * bet readonly vai kaut kādu fake disabled???
     */
    //setTimeout(() => el.disabled = true, 1);
}

function idle(el) {
    if (el.dataset.pl) {
        el.dataset.loading = el.dataset.pl;
    }

    delete el.dataset.pl;

    //el.disabled = el.dataset.pd == 'disabled';
    //delete el.dataset.pd;
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