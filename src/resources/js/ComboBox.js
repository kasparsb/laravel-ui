import {qa, q, r, on, clickp, dispatchEvent} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';

let optionsListCounter = 0;

/**
 * ! Neizmantojam data-r uz input lauku r(fieldEl).fieldValue
 * tas vajadzīgs, tāpēc, lai gala lietotājs varētu pats uzlikt
 * savus data-* atribūtus uz input lauku. Šajā mirklī es pieciešu
 * neertības, lai gala lietotājs var izmantot r() ērtības
 */

function fieldValue(fieldEl) {
    return q(fieldEl, 'input');
}

/**
 * Field select uzliek izvēlēto options
 */
function setOption(fieldEl, checkedOptionEl, {event} = {}) {
    if (typeof event == 'undefined') {
        event = true;
    }

    let isEmpty = true;
    let placeholderHTML = fieldEl.dataset.placeholder;
    let value = '';

    if (checkedOptionEl) {
        if (checkedOptionEl.dataset.value) {
            value = checkedOptionEl.dataset.value;
            placeholderHTML = checkedOptionEl.innerHTML;
            isEmpty = false;
        }
    }

    if (isEmpty) {
        fieldEl.dataset.isEmpty = '';
    }
    else {
        delete fieldEl.dataset.isEmpty
    }

    fieldValue(fieldEl).value = value;
    r(fieldEl).placeholder.innerHTML = placeholderHTML;

    if (event) {
        dispatchEvent(fieldValue(fieldEl), 'change');
    }
}

function open(fieldEl) {
    // jau ir atvērts
    if ('isOptionOpen' in fieldEl.dataset) {
        return
    }

    checkOptionsListId(fieldEl);

    fieldEl.dataset.isOptionOpen = '';
    OptionsPanel.open(getOptionsEl(fieldEl), {
        value: fieldValue(fieldEl).value,
        /**
         * Pozicionējam pret input lauku nevis container, jo container
         * ir description, kas nobīdīs OptionsPanel par zemu
         */
        triggerEl: q(fieldEl, 'input'),
        onSelectOption(optionEl) {
            setOption(fieldEl, optionEl);
        },
        onClose() {
            close(fieldEl);
            fieldValue(fieldEl).focus();
        }
    })
}

function close(fieldEl) {
    // Nav atvērts
    if (!('isOptionOpen' in fieldEl.dataset)) {
        return;
    }

    delete fieldEl.dataset.isOptionOpen;
    OptionsPanel.close(getOptionsEl(fieldEl), {
        // value uz kādu reset options list
        value: fieldValue(fieldEl).value,
    });
}

function toggleOpen(fieldEl) {
    if ('isOptionOpen' in fieldEl.dataset) {
        close(fieldEl)
    }
    else {
        open(fieldEl)
    }
}

/**
 * Pārbaudām vai OptionsList ir uzģenerēts unikāls id
 * sākumā OptionsList stāv ielikts FieldSelect elementā,
 * kad tas tiks parādīts, tas tiks izņemts no
 * FieldSelect un ielikts body
 * id būs reference uz OptionsList
 *
 * Sākumā OptionsList bija ārpus FieldSelect
 * bet tad radās problēma ar FieldSelect lauka klonēšanu
 * lauks noklonējās, bet reference uz OptionsList palika vecā
 */
function checkOptionsListId(fieldEl) {
    if (fieldEl.dataset.optionsListId) {
        return;
    }

    let optionsEl = q(fieldEl, '.options');
    if (optionsEl) {
        if (!optionsEl.id) {
            optionsEl.id = 'options-list-'+(optionsListCounter++);
            fieldEl.dataset.optionsListId = optionsEl.id;
        }
    }
}

/**
 * Ja ir norādīts options list id, tad meklējam pēc list id
 * ja nav, tad meklējam options elementu, kurš ir ielikts fieldEl
 */
function getOptionsEl(fieldEl) {
    if (fieldEl.dataset.optionsListId) {
        return q(`#${fieldEl.dataset.optionsListId}`);
    }
    return q(fieldEl, '.options');
}

export default {
    init() {

        clickp('.field-select', (ev, fieldEl) => {
            toggleOpen(fieldEl);
        })

        on('keydown', '.field-select', (ev, fieldEl) => {
            switch (ev.key) {
                case 'Enter':
                    // ja formā, tad būs submit, tāpēc prevent
                    ev.preventDefault();
                    toggleOpen(fieldEl);
                    break;
                case 'Escape':
                case 'Tab':
                    close(fieldEl)
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    setOption(fieldEl, OptionsPanel.nextOption(fieldEl.dataset.optionsListId));
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    setOption(fieldEl, OptionsPanel.prevOption(fieldEl.dataset.optionsListId));
            }
        });

        // Field start values ielikšana
        qa('.field-select').forEach(fieldEl => {
            let checkedOptionEl = OptionsPanel.findOptionByValue(
                getOptionsEl(fieldEl),
                fieldValue(fieldEl).value
            )

            setOption(fieldEl, checkedOptionEl, {
                event: false
            })
        });
    }
}