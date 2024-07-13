import {qa, r, on, clickp, dispatchEvent} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';

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

    r(fieldEl).fieldValue.value = value;
    r(fieldEl).placeholder.innerHTML = placeholderHTML;

    if (event) {
        dispatchEvent(r(fieldEl).fieldValue, 'change');
    }
}

function open(fieldEl) {
    // jau ir atvērts
    if ('isOptionOpen' in fieldEl.dataset) {
        return
    }

    fieldEl.dataset.isOptionOpen = '';
    OptionsPanel.open(fieldEl.dataset.optionsListId, {
        value: r(fieldEl).fieldValue.value,
        positionEl: fieldEl,
        onSelectOption(optionEl) {
            setOption(fieldEl, optionEl);
        },
        onClose() {
            close(fieldEl);
            r(fieldEl).fieldValue.focus();
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
        value: r(fieldEl).fieldValue.value,
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
                r(fieldEl).fieldValue.value
            )

            setOption(fieldEl, checkedOptionEl, {
                event: false
            })
        });
    }
}