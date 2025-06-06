import {
    q, qa, parent,
    submitp, submit, click,
    request, getFormData, jsonOrText,
    replace, clone
} from 'dom-helpers'
import Listeners from './helpers/Listeners';
import ButtonLoading from './ButtonLoading';
import ReplaceElWithNewHtmlIfNecessary from './helpers/ReplaceElWithNewHtmlIfNecessary';
import handleDropdownMenuHideFromEl from './helpers/handleDropdownMenuHideFromEl';

let onBeforeSubmitListeners = {};
let onAfterSubmitListeners = {};
let onAfterReplaceHtmlListeners = {};

let originalEl = [];

/**
 * Vai ir form aizvietotājs. Parasts div elements, kura jādarbojas līdzīgi kā form
 */
function isFormSubstitute(formEl) {
    if (!formEl.dataset) {
        return false;
    }

    return 'formSubstitute' in formEl.dataset;
}

function submitForm(formEl, url, method) {

    if (typeof url == 'undefined') {
        url = isFormSubstitute(formEl) ? formEl.dataset.action : formEl.action;
    }
    if (typeof method == 'undefined') {
        /**
         * Ja ir nodefinēts data-method tad ņemam to
         * x-ui::form vienmēr pielikts data-method
         * dēļ tā, ka html form atļauj tikai get vai post
         */
        if (formEl.dataset.method) {
            method = formEl.dataset.method
        }
        else {
            method = formEl.method;
        }
    }

    let formData = getFormData(formEl);
    if ('clickedSubmitButtonName' in formEl.dataset) {
        formData[formEl.dataset.clickedSubmitButtonName] = formEl.dataset.clickedSubmitButtonValue;
    }

    /**
     * Jāpieliek error handling. Un te ir jāatgriež jauna Promise
     */
    return request(method, url, formData)
        .then(response => jsonOrText(response))
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
    if ('isSubmitting' in formEl.dataset) {
        // Formā jau notiek submit
        return;
    }

    formEl.dataset.isSubmitting = '';

    /**
     * Šitas dublējas ar submit('form')
     * bet šo vajag, ja notiek form submit caur API
     * Pa lielam nekas, ja divreiz uzliks pogai loading.
     * Vienkrāši fetchSubmit gadījumā dublēsies
     */
    setButtonLoadingOnSubmit(formEl);


    if (onBeforeSubmitListeners['__any__']) {
        onBeforeSubmitListeners['__any__'].trigger([
            formEl,
        ])
    }

    let elReplacer = new ReplaceElWithNewHtmlIfNecessary(formEl);


    /**
     * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
     * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
     */
    handleDropdownMenuHideFromEl(formEl, 'onsubmit');

    return new Promise((resolve, reject) => {
        submitForm(formEl)
            .then(response => {

                let replacedEl = elReplacer.replace(response);

                // Aizstājam jauno formEl ar iepriekšējo
                if ('resetFormAfterSubmit' in formEl.dataset) {

                    if (replacedEl) {
                        if (typeof replacedEl.dataset != 'undefined') {
                            replacedEl.dataset.originalElId = formEl.dataset.originalElId;
                        }
                        formEl = replacedEl
                    }

                    formEl = reset(formEl);
                }

                delete formEl.dataset.isSubmitting;
                setButtonIdleAfterSubmit(formEl);

                if (onAfterSubmitListeners['__any__']) {
                    onAfterSubmitListeners['__any__'].trigger([
                        formEl,
                        response
                    ])
                }

                if (elReplacer.isReaplceHtml() && elReplacer.getElToReplace()) {
                    if (onAfterReplaceHtmlListeners['__any__']) {
                        onAfterReplaceHtmlListeners['__any__'].trigger([
                            elReplacer.getElToReplace()
                        ])
                    }
                }

                handleDropdownMenuHideFromEl(formEl, 'aftersubmit');

                // Ja ir ienākušas jaunas formas, kurām vajag uzstādīt setTimeout
                setTimeoutsForFormsWithSubmitAfterMs();

                resolve();
            })
    })

}

/**
 * Šis vajadzīgs tikai priekš tam, lai varētu resetot formu pēc submit
 * bet tas ir iespējams tikai, ja nenotiek šīs pašas forma replace html
 */
function saveFormElForReset(formEl) {
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

function handleDropdownMenuHide(formEl, eventName) {
    if (!('menuHide' in formEl.dataset)) {
        return;
    }

    if (formEl.dataset.menuHide == eventName) {
        let menuEl = DropdownMenu.getByChild(formEl);
        if (menuEl) {
            DropdownMenu.close(menuEl);
        }
    }
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

        /**
         * Save orginal form el, lai varētu resetot pēc vajadzības (pēc submit)
         * šo nevajag priekš replace-html, jo tad forma tiks aizstāta ar content no servera
         * tikai, ja ir data-reset-form-after-submit
         */
        qa('form[data-reset-form-after-submit]').forEach(formEl => {
            saveFormElForReset(formEl);
        })

        setTimeoutsForFormsWithSubmitAfterMs();
    },
    submit(formEl) {
        if ('fetchSubmit' in formEl.dataset) {
            return handleSubmit(formEl)
        }
        else {
            formEl.submit();
        }
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
    onAfterReplaceHtml(cb) {
        if (typeof onAfterReplaceHtmlListeners['__any__'] == 'undefined') {
            onAfterReplaceHtmlListeners['__any__'] = new Listeners();
        }
        onAfterReplaceHtmlListeners['__any__'].listen(cb);
    },
    /**
     * Atjauno formu atpakaļ uz sākuma stāvokli
     */
    reset(formEl) {
        if (!formEl) {
            return;
        }
        return reset(formEl);
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