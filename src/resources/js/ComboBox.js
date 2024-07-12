import {
    q, qa, r, parent, append, isChild, next, prev, on, clickp,
    getOuterDimensions, addStyle,
} from 'dom-helpers';
import SingletonPanel from './SingletonPanel';

let openedSelectFieldEl;
let optionsRef;

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
}

function uncheck(el) {
    if (el) {
        delete el.dataset.checked;
    }
}

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

function getChecked(optionsEl) {
    return q(optionsEl, '[data-r="option"][data-checked]');
}

function nextOption(fieldEl) {
    let optionsEl = findOptionsEl(fieldEl);
    let currentOptionEl = getChecked(optionsEl);
    if (currentOptionEl) {
        let nextEl = next(currentOptionEl, '[data-r="option"]');
        if (nextEl) {
            uncheck(currentOptionEl);
            check(nextEl);
            setOption(fieldEl, nextEl);
        }
    }
    else {
        check(first(qa(optionsEl, '[data-r="option"]')), optionsEl);
    }
}

function prevOption(fieldEl) {
    let optionsEl = findOptionsEl(fieldEl);
    let currentOptionEl = getChecked(optionsEl);
    if (currentOptionEl) {
        let prevEl = prev(currentOptionEl, '[data-r="option"]');
        if (prevEl) {
            uncheck(currentOptionEl);
            check(prevEl);
            setOption(fieldEl, prevEl);
        }
    }
    else {
        check(last(qa(optionsEl, '[data-r="option"]')));
    }
}

/**
 * Kad options ir atvērts, tad tas vairs nav fieldSelecet elementā
 * tas ir ielikts SingletonPanel
 * tāpēc, kad atveram, tad referenci pieglabājam mainīgajā
 */
function findOptionsEl(fieldEl) {
    if (fieldEl.dataset.isOpen) {
        return optionsRef;
    }
    else {
        return q(fieldEl, '[data-r="options"]');
    }
}

function findOptionByValue(optionsEl, value) {
    return q(optionsEl, `[data-r="option"][data-value="${value}"]`);
}

/*
 * Atveram options list
 */
function openOptions(fieldEl) {

    let optionsEl = findOptionsEl(fieldEl);

    // uz atvēršanu vajag uzlikt checked to, kura vērtība atbilst fieldEl vērtībai
    uncheck(getChecked(optionsEl));
    check(findOptionByValue(optionsEl, r(fieldEl).fieldValue.value))

    openedSelectFieldEl = fieldEl;
    optionsRef = optionsEl;

    fieldEl.dataset.isOpen = true;

    setTimeout(() => {
        SingletonPanel.show(optionsEl, {
            onContentElRemove(optionsEl) {
                append(fieldEl, optionsEl)
            },
            positionEl: fieldEl,
            side: 'bottom',
            align: 'left',
            width: 'positionEl.width'
        })

        addStyle(optionsEl, {
            width: getOuterDimensions(fieldEl).width+'px',
        })
    }, 5)
}

function closeOptions(fieldEl) {
    delete fieldEl.dataset.isOpen;
    openedSelectFieldEl = undefined;
    optionsRef = undefined;
    SingletonPanel.close();
}

export default {
    init() {

        clickp('.field-select', (ev, fieldEl) => {
            r(fieldEl).fieldValue.focus();
            openOptions(fieldEl);
        })

        // kad atvērts, tad options vairs nav .field-select elementā, bet Panelī
        clickp('[data-r="options"] [data-r="option"]', (ev, optionEl) => {
            let optionsEl = findOptionsEl(openedSelectFieldEl);
            let currentOptionEl = getChecked(optionsEl);

            uncheck(currentOptionEl);
            check(optionEl);
            setOption(openedSelectFieldEl, optionEl);

            closeOptions(openedSelectFieldEl);
        })

        // unchecked checked and set checked currently hovered
        on('mouseover', '[data-r="options"] [data-r="option"]', (ev, optionEl) => {
            uncheck(getChecked(parent(optionEl, '[data-r="options"]')));
            check(optionEl);
        })

        on('keydown', '.field-select', (ev, fieldEl) => {
            switch (ev.key) {
                case 'Enter':
                    if (fieldEl.dataset.isOpen) {
                        closeOptions(fieldEl);
                    }
                    else {
                        openOptions(fieldEl)
                    }
                    break;
                case 'Escape':
                case 'Tab':
                    if (fieldEl.dataset.isOpen) {
                        closeOptions(fieldEl);
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    nextOption(fieldEl);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    prevOption(fieldEl);
                    break;
            }
        });

        on('click', 'html', ev => {
            // Ja ir .field-data input, tad skip
            if (parent(ev.target, '.field-select')) {
                // skip
            }
            else {
                if (isChild(ev.target, SingletonPanel.getEl())) {
                    // skip
                }
                else {
                    if (openedSelectFieldEl) {
                        closeOptions(openedSelectFieldEl)
                    }
                }
            }
        })
    }
}