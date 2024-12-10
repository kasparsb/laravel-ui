import {
    q, qa, parent,
    submitp, submit, click,
    request, getFormData,
    replace, clone
} from 'dom-helpers'
import Listeners from './helpers/Listeners';
import ButtonLoading from './ButtonLoading';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';

let onBeforeSubmitListeners = {};
let onAfterSubmitListeners = {};

let originalEl = [];

/**
 * Vai ir form aizvietotājs. Parasts div elements, kura jādarbojas līdzīgi kā form
 */
function isSubstitute(formEl) {
    if (!formEl.dataset) {
        return false;
    }

    return 'formSubstitute' in formEl.dataset;
}

function submitForm(formEl, url, method) {
    if (typeof url == 'undefined') {
        url = isSubstitute(formEl) ? formEl.dataset.action : formEl.action;
    }
    if (typeof method == 'undefined') {
        method = isSubstitute(formEl) ? formEl.dataset.method : formEl.method;
    }

    let formData = getFormData(formEl);
    if ('clickedSubmitButtonName' in formEl.dataset) {
        formData[formEl.dataset.clickedSubmitButtonName] = formEl.dataset.clickedSubmitButtonValue;
    }

    /**
     * Jāpieliek error handling. Un te ir jāatgriež jauna Promise
     */
    return request(method, url, formData)
        .then(response => response.text())
}

/**
 * Uzliek loading pogām loading, ja tām ir onsumit
 */
function setButtonLoadingOnSubmit(formEl) {
    qa(formEl, 'button[data-loading="onsubmit"]').forEach(buttonEl => {
        ButtonLoading.loading(buttonEl);
    })
}

function setButtonIdleAfterSubmit(formEl) {
    qa(formEl, 'button[data-loading="loading"]').forEach(buttonEl => {
        ButtonLoading.idle(buttonEl);
    })
}

function handleSubmit(formEl) {

    /**
     * Šitas dublējas ar submit('form')
     * bet šo vajag, ja notiek form submit caur API
     * Pa lielam nekas, ja divreiz uzliks pogai loading.
     * Vienkrāši fetshSubmit gadījumā dublēsies
     */
    setButtonLoadingOnSubmit(formEl);


    if (onBeforeSubmitListeners['__any__']) {
        onBeforeSubmitListeners['__any__'].trigger([
            formEl,
        ])
    }

    let elReplacer = new ReplaceElWithNewHtmlIfNecessary(formEl);

    return new Promise((resolve, reject) => {
        submitForm(formEl)
            .then(r => {

                let originalElId = formEl.dataset.originalElId;

                let newFormEl = elReplacer.replace(r);
                if (newFormEl) {
                    if (typeof newFormEl.dataset != 'undefined') {
                        newFormEl.dataset.originalElId = originalElId;
                    }
                    formEl = newFormEl
                }

                setButtonIdleAfterSubmit(formEl);

                if (onAfterSubmitListeners['__any__']) {
                    onAfterSubmitListeners['__any__'].trigger([
                        formEl,
                        r
                    ])
                }

                if ('resetFormAfterSubmit' in formEl.dataset) {
                    reset(formEl);
                }

                // Ja ir ienākušas jaunas formas, kurām vajag uzstādīt setTimeout
                setTimeoutsForFormsWithSubmitAfterMs();

                resolve();
            })
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

/**
 * Atrodam formas, kuras vajag submit pēc norādītā laika
 */
function setTimeoutsForFormsWithSubmitAfterMs() {
    qa('[data-submit-form-after-ms]').forEach(formEl => {
        // Ja ir jau uzlikts timeout, tad skip
        if ('submitTimeoutSet' in formEl.dataset) {
            return;
        }

        let timeoutMs = parseInt(formEl.dataset.submitFormAfterMs, 10);
        if (timeoutMs) {
            // Pazīme, ka timeout jau ir uzlikts
            formEl.dataset.submitTimeoutSet = '';
            // Pieglabājam timeout, lai var atcelt
            formEl.dataset.submitFormAfterTimeout = setTimeout(() => {
                handleSubmit(formEl)
                delete formEl.dataset.submitFormAfterTimeout
            }, timeoutMs)
        }
    })
}

export default {
    init() {
        // Tikai priekš button[data-loading="submit"]
        submit('form', (ev, formEl) => setButtonLoadingOnSubmit(formEl));

        /**
         * Submit buttons with name
         * Ja ir vairākas submit pogas ar vienādiem name,
         * tad vajag submitot to button value, kura tika click
         */
        click('form[data-fetch-submit] [type=submit][name]', (ev, buttonSubmitEl) => {
            let formEl = parent(buttonSubmitEl, 'form');

            delete formEl.dataset.clickedSubmitButtonName;
            delete formEl.dataset.clickedSubmitButtonValue;

            // Uzliekam formai, nospiestās submit pogas name un value
            if (buttonSubmitEl.name) {
                formEl.dataset.clickedSubmitButtonName = buttonSubmitEl.name;
                formEl.dataset.clickedSubmitButtonValue = buttonSubmitEl.value;
            }
        })

        submitp('form[data-fetch-submit]', (ev, formEl) => {
            handleSubmit(formEl);
        })

        // Save orginal content el
        qa('form[data-fetch-submit][data-replace-html], form[data-reset-form-after-submit]').forEach(formEl => {
            saveOriginalEl(formEl);
        })

        setTimeoutsForFormsWithSubmitAfterMs();
    },
    submit(formEl) {
        return handleSubmit(formEl)
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