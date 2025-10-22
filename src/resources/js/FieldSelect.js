import {qa, qr, q, parent, on, dispatchEvent, get} from 'dom-helpers';
import OptionsPanel from './OptionsPanel';
import DropdownMenu from './DropdownMenu';
import InputValuePreview from './InputValuePreview';
import FieldSelectEmptyState from './FieldSelectEmptyState';
import Form from './Form';
import Repeatable from './Repeatable';
import LimitedBatch from './helpers/LimitedBatch';
import isArray from './helpers/isArray';

// Limit, lai vienlaicīgi izpildās tikai 4
let loadValueVisualBatch = new LimitedBatch(4);

/**
 * Ja ir norādīts options list id, tad meklējam pēc list id
 * ja nav, tad meklējam options elementu, kurš ir ielikts fieldEl
 */
function getOptionsEl(fieldEl) {
    return q(DropdownMenu.getMenuEl(q(fieldEl, '[data-dropdown-menu-trigger]')), '.options');
}

/**
 * Field select uzliek izvēlēto option vizuālo vērtību
 */
function setOption(fieldEl, checkedOptionEl) {

    let placeholderHtml = '';
    if (typeof checkedOptionEl == 'string') {
        placeholderHtml = checkedOptionEl;
    }
    /**
     * TODO kāpēc šeit tiek pārbaudīts vai ir dataset.value?
     */
    else if (checkedOptionEl && checkedOptionEl.dataset.value) {
        placeholderHtml = checkedOptionEl.outerHTML
    }

    InputValuePreview.setPlaceholder(
        fieldEl,
        placeholderHtml
    );
}

function handleFieldValueChange(fieldEl) {

    let checkedOptionEl = OptionsPanel.findOptionByValue(
        getOptionsEl(fieldEl),
        q(fieldEl, 'input').value
    )

    /**
     * Ja nav atrasts value atbilstošais OptionEl, tad padodam vienkārši value,
     * lai vismaz value izvadās
     */
    setOption(
        fieldEl,
        checkedOptionEl ? checkedOptionEl : q(fieldEl, 'input').value,
        {
            event: false
        }
    )
}

function setupPlaceholder(listOfFieldSelectEls) {
    listOfFieldSelectEls.forEach(fieldEl => {

        // Ja ir manuāli uzstādīts value visual vērtība, tad skip
        if ('hasVisualValue' in fieldEl.dataset) {
            return
        }

        // Ielādējam initial valueVisual no url
        if ('loadInitialValueVisual' in fieldEl.dataset) {
            loadValueVisual(fieldEl);
            return;
        }

        handleFieldValueChange(fieldEl);
    });
}

function loadValueVisual(fieldEl) {
    if (!fieldEl.dataset.valueVisualUrl) {
        console.warn('Field select has set loadInitialValueVisual but there is no defined valueVisualUrl');
        return;
    }

    /**
     * TODO varbūt vajag uzlikt pazīmi, ka request in progress???
     */

    let value = q(fieldEl, 'input').value;

    // Ja nav value, tad notīrām placeholder
    if (!value) {
        setOption(
            fieldEl,
            '',
            {
                event: false
            }
        )
        return;
    }

    loadValueVisualBatch.add(() => {

        return get(fieldEl.dataset.valueVisualUrl, {
            value: value
        })
            .then(valueVisualHtml => {

                setOption(
                    fieldEl,
                    valueVisualHtml,
                    {
                        event: false
                    }
                )

            })

    })
}

export default {
    init() {

        // Empty state stāvoklis
        FieldSelectEmptyState.init();

        // Field start values ielikšana
        setupPlaceholder(qa('.field-select'))


        /**
         * Form.onAfterReplaceHtml,
         * Repeatable.onAfterNewItem
         * lai var izvadīt option placeholder vērtību
         *
         * šīs ir tās vietas, kurās dinamiski tiek ievietoti jauno dom elementi
         * tiem vajag palaist apstrādes
         *
         * TODO varbūt vajag kaut kādu centralizētu event
         */
        Form.onAfterReplaceHtml(newEl => {
            if (!isArray(newEl)) {
                newEl = [newEl];
            }
            newEl.forEach(newEl => {
                setupPlaceholder(qa(newEl, '.field-select'))
            })
        })
        Repeatable.onAfterNewItem(newEl => {
            setupPlaceholder(qa(newEl, '.field-select'))
        })



        // Kad nomainās input value, tad uzliekam atbilstošo vizuālo value
        on('change', '.field-select input', (ev, inputEl) => {
            let fieldEl = parent(inputEl, '.field-select');
            handleFieldValueChange(fieldEl);


            // Izpildām data-on-change event
            if (fieldEl.dataset.onChange) {
                if (fieldEl.dataset.onChange == 'submit') {
                    Form.submit(
                        Form.findParentForm(fieldEl)
                    )
                }
                else if (fieldEl.dataset.onChange.startsWith('submit:')) {
                    Form.submit(
                        qr(fieldEl, fieldEl.dataset.onChange.slice(7))
                    )
                }
            }
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
    },

    /**
     * Sagatavojam viss field-select laukus padotajā containerEl
     */
    setup(containerEl) {
        setupPlaceholder(qa(containerEl, '.field-select'))
    }
}