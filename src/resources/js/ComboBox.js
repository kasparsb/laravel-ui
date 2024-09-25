import {qa, q, parent, on, dispatchEvent} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';
import DropdownMenu from './DropdownMenu';
import InputValuePreview from './InputValuePreview';

/**
 * Field select uzliek izvēlēto option vizuālo vērtību
 */
function setOption(fieldEl, checkedOptionEl) {
    InputValuePreview.setPlaceholder(
        fieldEl,
        // Formatēta date value
        (checkedOptionEl && checkedOptionEl.dataset.value) ? checkedOptionEl.innerHTML : ''
    );
}

/**
 * Ja ir norādīts options list id, tad meklējam pēc list id
 * ja nav, tad meklējam options elementu, kurš ir ielikts fieldEl
 */
function getOptionsEl(fieldEl) {
    return q(DropdownMenu.getMenuEl(q(fieldEl, '[data-dropdown-menu-trigger]')), '.options');
}

function handleFieldValueChange(fieldEl) {
    let checkedOptionEl = OptionsPanel.findOptionByValue(
        getOptionsEl(fieldEl),
        q(fieldEl, 'input').value
    )

    setOption(fieldEl, checkedOptionEl, {
        event: false
    })
}

export default {
    init() {

        // Kad nomainās input value, tad uzliekam atbilstošo vizuālo value
        on('change', '.field-select input', (ev, inputEl) => {
            handleFieldValueChange(parent(inputEl, '.field-select'));
        })

        on('keydown', '.field-select', (ev, fieldEl) => {
            let inputEl;
            switch (ev.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    let nextOption = OptionsPanel.nextOption(getOptionsEl(parent(fieldEl, '.field-select')));
                    inputEl = q(fieldEl, 'input');

                    inputEl.value = nextOption ? nextOption.dataset.value : ''
                    dispatchEvent(inputEl, 'change');

                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    let prevOption = OptionsPanel.prevOption(getOptionsEl(parent(fieldEl, '.field-select')));
                    inputEl = q(fieldEl, 'input');

                    inputEl.value = prevOption ? prevOption.dataset.value : ''
                    dispatchEvent(inputEl, 'change');
            }
        });

        // Field start values ielikšana
        qa('.field-select').forEach(fieldEl => {
            handleFieldValueChange(fieldEl);
        });
    }
}