import {
    q, qa,
    next, prev,
    parent, on, clickp,
    dispatchEvent
} from 'dom-helpers';
import fuzzysearch from './helpers/fuzzysearch';
import DropdownMenu from './DropdownMenu';

function first(nodeList) {
    return nodeList.length > 0 ? nodeList[0] : null
}

function last(nodeList) {
    return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null
}

function check(el) {
    if (el) {
        el.dataset.checked = '';
    }
    return el;
}

function uncheck(el) {
    if (el) {
        delete el.dataset.checked;
    }
    return el;
}

function getChecked(optionsEl) {
    return q(optionsEl, '[data-options-list-option][data-checked]');
}

function findOptionByValue(optionsEl, value) {
    return q(optionsEl, `[data-options-list-option][data-value="${value}"]`);
}

function nextOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});

    // Ja ir izfiltrēts
    if (currentOptionEl && currentOptionEl.hidden) {
        // uncheck
        uncheck(currentOptionEl);
        // un uzskatās, ka nav atrasts
        currentOptionEl = null;
    }
    if (currentOptionEl) {
        let nextEl = next(currentOptionEl, '[data-options-list-option]:not([hidden])');
        if (nextEl) {
            uncheck(currentOptionEl);
            return check(nextEl);
        }
        else {
            return currentOptionEl;
        }
    }
    else {
        return check(first(qa(optionsEl, '[data-options-list-option]:not([hidden])')), optionsEl);
    }
}

function prevOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});
    // Ja ir izfiltrēts
    if (currentOptionEl && currentOptionEl.hidden) {
        // uncheck
        uncheck(currentOptionEl);
        // un uzskatās, ka nav atrasts
        currentOptionEl = null;
    }
    if (currentOptionEl) {
        let prevEl = prev(currentOptionEl, '[data-options-list-option]:not([hidden])');
        if (prevEl) {
            uncheck(currentOptionEl);
            return check(prevEl);
        }
        else {
            return currentOptionEl;
        }
    }
    else {
        return check(last(qa(optionsEl, '[data-options-list-option]:not([hidden])')));
    }
}

function filterOptionsByValue(optionsEl, value) {
    value = value.toLowerCase();

    qa(optionsEl, '[data-options-list-option]').forEach(optionEl => {
        if (value) {
            if (fuzzysearch(value, optionEl.innerText.toLowerCase())) {
                optionEl.hidden = false;
            }
            else {
                optionEl.hidden = true;
            }
        }
        else {
            optionEl.hidden = false;
        }
    })
}

/**
 * Kad options list atrodas Dropdown menu, tad
 * atrodam to un tā openTriggerEl
 * openTriggerEl būs tas, kurā ielikt izvēlēto options
 */
function findFieldValue(optionsEl) {
    return DropdownMenu.getOpenTriggerByChild(optionsEl);
}

function setFieldValue(optionsEl, selectedOptionEl) {
    let fieldValue = findFieldValue(optionsEl);
    fieldValue.value = selectedOptionEl.dataset.value;
    dispatchEvent(fieldValue, 'change');
}

export default {
    init() {


        /**
         * TODO Dropdown uz atvēršanu focus first input
         * tas lai search lauks tiktu uzreiz iefokusēts
         *
         * Uz aizvēršanu notīrīt search, parādīt hidden options
         * uzlikt pareizo selected
         */


        on('keydown', '.options', (ev, optionsEl) => {

            switch (ev.key) {
                case 'Enter':
                    // Ja ir search field, tad neveram ciet
                    if (!('fieldSelectSearchField' in ev.target.dataset)) {
                        DropdownMenu.close(DropdownMenu.getByChild(optionsEl))
                    }

                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    ev.preventDefault();
                    setFieldValue(optionsEl, nextOption(optionsEl))

                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    ev.preventDefault();
                    setFieldValue(optionsEl, prevOption(optionsEl))

                    break;
            }
        });

        // Filtrēšana
        on('keyup', '.options [data-field-select-search-field]', (ev, inputEl) => {
            let optionsEl = parent(inputEl, '.options');
            if ('ignoreFirstKeyup' in optionsEl.dataset) {
                delete optionsEl.dataset.ignoreFirstKeyup;
            }
            else {
                filterOptionsByValue(optionsEl, inputEl.value)
            }
        })

        // Options click
        clickp('.options [data-options-list-option]', (ev, optionEl) => {
            let optionsEl = parent(optionEl, '.options');

            let currentOptionEl = getChecked(optionsEl);

            uncheck(currentOptionEl);
            check(optionEl);

            setFieldValue(optionsEl, optionEl)

            // aizvērsies, jo options ir kā menu-item un Dropdown tādus uz click aizver
        })

        /**
         * Šo laikam vajag tikai, ja ir FieldSelect režīms
         * unchecked checked and set checked currently hovered
         *
         * šis imitē native select box behaviour
         */
        on('mouseover', '.options [data-options-list-option]', (ev, optionEl) => {
            let optionsEl = parent(optionEl, '.options');
            uncheck(getChecked(optionsEl));
            check(optionEl);
        })
    },

    findOptionByValue(optionsEl, value) {
        return findOptionByValue(optionsEl, value)
    },

    nextOption(optionsEl) {
        return nextOption(optionsEl);
    },

    prevOption(optionsEl) {
        return prevOption(optionsEl);
    }
}