import {q, qa, submitp, submit, submitForm, replace, clone} from 'dom-helpers'
import Listeners from './helpers/Listeners';
import ButtonLoading from './ButtonLoading';

let onBeforeSubmitListeners = {};
let onAfterSubmitListeners = {};

let originalEl = [];

/**
 * Uzliek loading pogām loading, ja tām ir onsumit
 */
function setButtonLoadingOnSubmit(formEl) {
    qa(formEl, 'button[data-loading="onsubmit"]').forEach(buttonEl => {
        ButtonLoading.loading(buttonEl);
    })
}

function setButtonIdleAfterSubmit(formEl) {
    qa(formEl, 'button[data-loading="onsubmit"]').forEach(buttonEl => {
        ButtonLoading.idle(buttonEl);
    })
}

function handleSubmit(formEl) {
    if (onBeforeSubmitListeners['__any__']) {
        onBeforeSubmitListeners['__any__'].trigger([
            formEl,
        ])
    }

    submitForm(formEl)
        .then(r => {
            if ('replaceHtml' in formEl.dataset) {

                let originalElId = formEl.dataset.originalElId;
                formEl = replace(formEl, r);
                formEl.dataset.originalElId = originalElId;
            }

            setButtonIdleAfterSubmit(formEl);

            if (onAfterSubmitListeners['__any__']) {
                onAfterSubmitListeners['__any__'].trigger([
                    formEl,
                    r
                ])
            }
        })
}

function saveOriginalEl(formEl) {
    if ('originalElId' in formEl.dataset) {
        return;
    }

    let clonedFormEl = clone(formEl);
    let i = originalEl.push(clonedFormEl);
    clonedFormEl.dataset.originalElId = i - 1;
    formEl.dataset.originalElId = i - 1;

    return formEl.dataset.originalElId;
}

function reset(formEl) {
    if (!('originalElId' in formEl.dataset)) {
        return;
    }

    formEl = replace(formEl, clone(originalEl[formEl.dataset.originalElId]));
    let buttonEl = q(formEl, '[type=submit]');
    if (buttonEl) {
        ButtonLoading.idle(buttonEl);
    }
    return formEl;
}

function setBusy(formEl) {
    let buttonEl = q(formEl, '[type=submit]');
    if (buttonEl) {
        ButtonLoading.loading(buttonEl);
    }
}

function setNotBusy(formEl) {
    let buttonEl = q(formEl, '[type=submit]');
    if (buttonEl) {
        ButtonLoading.idle(buttonEl);
    }
}

export default {
    init() {
        // Tikai priekš button[data-loading="submit"]
        submit('form', (ev, formEl) => setButtonLoadingOnSubmit(formEl));

        submitp('form[data-fetch-submit]', (ev, formEl) => {
            handleSubmit(formEl);
        })

        // Save orginal content el
        qa('form[data-fetch-submit][data-replace-html]').forEach(formEl => {
            saveOriginalEl(formEl);
        })
    },
    submit(formEl) {
        submitForm(formEl)
    },
    onBeforeSubmit(cb) {
        if (typeof onBeforeSubmitListeners['__any__'] == 'undefined') {
            onBeforeSubmitListeners['__any__'] = new Listeners();
        }
        onBeforeSubmitListeners['__any__'].listen(cb);
    },
    onAfterSubmit(cb) {
        if (typeof onAfterSubmitListeners['__any__'] == 'undefined') {
            onAfterSubmitListeners['__any__'] = new Listeners();
        }
        onAfterSubmitListeners['__any__'].listen(cb);
    },
    /**
     * Atjauno formu atpakaļ uz sākuma stāvokli
     */
    reset(formEl) {
        if (!formEl) {
            return;
        }
        reset(formEl);
    },

    /**
     * Uzstāda, ka form ir aizņemt un to nevar submitot
     */
    setBusy(formEl) {
        if (!formEl) {
            return;
        }
        setBusy(formEl)
    },

    setNotBusy(formEl) {
        if (!formEl) {
            return;
        }
        setNotBusy(formEl)
    }
}