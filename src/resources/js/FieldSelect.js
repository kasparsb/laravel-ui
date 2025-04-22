import {qa, q, parent, on, dispatchEvent, get} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';
import DropdownMenu from './DropdownMenu';
import InputValuePreview from './InputValuePreview';
import FieldSelectEmptyState from './FieldSelectEmptyState';
import Form from './Form';

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

function setupVisualValue(listOfFieldSelectEls) {
    listOfFieldSelectEls.forEach(fieldEl => {
        // Ja ir manuāli uzstādīts value visual vērtība, tad skip
        if ('hasVisualValue' in fieldEl.dataset) {
            return
        }

        handleFieldValueChange(fieldEl);
    });
}

export default {
    init() {

        // Empty state stāvoklis
        FieldSelectEmptyState.init();

        // Field start values ielikšana
        setupVisualValue(qa('.field-select'))

        // onAfterSubmit, lai var izvadīt option placeholder vērtību
        Form.onAfterSubmit(formEl => setupVisualValue(qa(formEl, '.field-select')))


        // Kad nomainās input value, tad uzliekam atbilstošo vizuālo value
        on('change', '.field-select input', (ev, inputEl) => {
            handleFieldValueChange(parent(inputEl, '.field-select'));
        })

        on('keydown', '.field-select', (ev, fieldEl) => {
            let inputEl;
            switch (ev.key) {
                case 'Home':
                    let firstOption = OptionsPanel.firstOption(getOptionsEl(parent(fieldEl, '.field-select')));
                    inputEl = q(fieldEl, 'input');

                    inputEl.value = firstOption ? firstOption.dataset.value : ''
                    dispatchEvent(inputEl, 'change');

                    break;
                case 'End':
                    let lastOption = OptionsPanel.lastOption(getOptionsEl(parent(fieldEl, '.field-select')));
                    inputEl = q(fieldEl, 'input');

                    inputEl.value = lastOption ? lastOption.dataset.value : ''
                    dispatchEvent(inputEl, 'change');

                    break;
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
    }
}