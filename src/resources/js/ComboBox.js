import {qa, q, parent, on, dispatchEvent, get} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';
import DropdownMenu from './DropdownMenu';
import InputValuePreview from './InputValuePreview';
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

/**
 * Taisto click uz form [type=submit] pogas, kad
 * notiek submit pazūd fokuss. Šajā mirklī aizvērsies
 * DropdownMenu, kurā ir forma. Tāpēc, ja forma ir
 * FieldSelect Dropdown menu, tad lieka, lai ignore focousOut
 */
function handleBeforeSubmit(formEl) {
    // Ja ir empty state elementā, tad skip
    if (!parent(formEl, '[data-field-select-empty-state]')) {
        return
    }

    DropdownMenu.ignoreFocusoutOnce(DropdownMenu.getByChild(formEl))
}

/**
 * Kad forma ir nosubmitota
 * tad vajag kaut kur iegūt value un valueVisual
 * value būs formā, laikā id (šitas konfigurējams)
 * valueVisual būs jāpieprasa no url
 */
function handleAfterSubmit(formEl) {
    // Ja ir empty state elementā, tad skip
    if (!parent(formEl, '[data-field-select-empty-state]')) {
        return
    }

    let valueFieldName = 'id';

    let valueFieldEl = q(formEl, `[name=${valueFieldName}]`);
    if (valueFieldEl) {
        let openTriggerEl = DropdownMenu.getOpenTriggerByChild(formEl);
        let fieldEl = parent(openTriggerEl, '.field-select');
        let inputEl = q(fieldEl, 'input');
        inputEl.value = valueFieldEl.value;
        dispatchEvent(inputEl, 'change');



        // ielādējam valueVisual html
        if ('valueVisualUrl' in fieldEl.dataset) {
            get(fieldEl.dataset.valueVisualUrl, {
                value: inputEl.value
            })
                .then(valueVisualHtml => {
                    InputValuePreview.setPlaceholder(
                        fieldEl,
                        // Formatēta date value
                        valueVisualHtml
                    );

                    DropdownMenu.closeByOpenTrigger(openTriggerEl)
                    Form.reset(formEl);
                })
        }
    }
}

export default {
    init() {

        // Klausāmies uz From submit
        Form.onBeforeSubmit(formEl => handleBeforeSubmit(formEl))
        Form.onAfterSubmit(formEl => handleAfterSubmit(formEl))

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

        // Field start values ielikšana
        qa('.field-select').forEach(fieldEl => {
            // Ja ir manuāli uzstādīts value visual vērtība, tad skip
            if ('hasVisualValue' in fieldEl.dataset) {
                return
            }
            handleFieldValueChange(fieldEl);
        });
    }
}