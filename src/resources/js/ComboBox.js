import {qa, q, r, on, clickp, dispatchEvent} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';

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

    fieldEl.dataset.isOptionOpen = '';
    OptionsPanel.open(fieldEl.dataset.optionsListId, {
        value: fieldValue(fieldEl).value,
        /**
         * Pozicionējam pret input lauku nevis container, jo container
         * ir description, kas nobīdīs OptionsPanel par zemu
         */
        positionEl: q(fieldEl, 'input'),
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
    OptionsPanel.close(fieldEl.dataset.optionsListId, {
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

export default {
    init() {

        clickp('.field-select', (ev, fieldEl) => {
            toggleOpen(fieldEl);
        })

        on('keydown', '.field-select', (ev, fieldEl) => {
            switch (ev.key) {
                case 'Enter':
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
                fieldEl.dataset.optionsListId,
                fieldValue(fieldEl).value
            )

            setOption(fieldEl, checkedOptionEl, {
                event: false
            })
        });
    }
}