import {qa, r, on, clickp} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';

/**
 * Field select uzliek izvēlēto options
 */
function setOption(fieldEl, checkedOptionEl) {
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
}

function open(fieldEl) {
    if (!('isOptionOpen' in fieldEl.dataset)) {
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
    fieldEl.dataset.isOptionOpen = '';
}

function close(fieldEl) {
    if ('isOptionOpen' in fieldEl.dataset) {
        OptionsPanel.close(fieldEl.dataset.optionsListId);
    }
    delete fieldEl.dataset.isOptionOpen;
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
            }
        });

        // Select
        qa('.field-select').forEach(fieldEl => {
            let checkedOptionEl = OptionsPanel.findOptionByValue(
                fieldEl.dataset.optionsListId,
                r(fieldEl).fieldValue.value
            )

            setOption(fieldEl, checkedOptionEl)
        });
    }
}