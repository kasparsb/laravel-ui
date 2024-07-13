import {
    q, r, qa, is, addClass, removeClass, append, getOuterDimensions,
    next, prev, addStyle,
    parent, on, clickp, isChild,
} from 'dom-helpers';
import SingletonPanel from './SingletonPanel';
import fuzzysearch from './helpers/fuzzysearch';

let selectOptionCb, closeCb, isPanelOpen = false;
// close timeout
let closeT = 0;

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
    return q(optionsEl, '[data-r="option"][data-checked]');
}

function findOptionByValue(optionsEl, value) {
    return q(optionsEl, `[data-r="option"][data-value="${value}"]`);
}

function nextOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl);
    if (currentOptionEl) {
        let nextEl = next(currentOptionEl, '[data-r="option"]');
        if (nextEl) {
            uncheck(currentOptionEl);
            return check(nextEl);
        }
        return currentOptionEl;
    }
    else {
        return check(first(qa(optionsEl, '[data-r="option"]')), optionsEl);
    }
}

function prevOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl);
    if (currentOptionEl) {
        let prevEl = prev(currentOptionEl, '[data-r="option"]');
        if (prevEl) {
            uncheck(currentOptionEl);
            return check(prevEl);
        }
        return currentOptionEl;
    }
    else {
        return check(last(qa(optionsEl, '[data-r="option"]')));
    }
}

/*
 * Atveram options list
 */
function open(optionsEl, {positionEl, value, onSelectOption, onClose} = {}) {

    clearTimeout(closeT);

    isPanelOpen = true;

    selectOptionCb = onSelectOption;
    closeCb = onClose;

    // Pazīme, ka atvērts panelī
    optionsEl.dataset.isInPanel = '';

    setValue(optionsEl, value);

    // Ir meklēšanas lauks
    // if (r(fieldEl).fieldSearch) {

    // }

    setTimeout(() => {
        SingletonPanel.show(optionsEl, {
            onContentElRemove(optionsEl) {

                isPanelOpen = false;

                delete optionsEl.dataset.isInPanel;

                addClass(optionsEl, 'hidden')
                // append back to body, jo var būt vairāki menu un tos meklēs body
                append(q('body'), optionsEl);
            },
            positionEl: positionEl,
            side: 'bottom',
            align: 'left',
        })

        removeClass(optionsEl, 'hidden');

        addStyle(optionsEl, {
            width: getOuterDimensions(positionEl).width+'px',
        })

        /**
         * TODO fokusēšana, jāskatās vai ir searchField
         */
        optionsEl.focus();

    }, 5)
}

function close(optionsEl) {
    // Ja panelī ir norādītais optionsEl, tad close
    if (optionsEl == SingletonPanel.getContentEl()) {
        SingletonPanel.close();
    }
}

/**
 * Uzstāda to options, kurš atbilst padotajam value
 */
function setValue(optionsEl, value) {
    uncheck(getChecked(optionsEl));
    check(findOptionByValue(optionsEl, value))
}

function filterOptionsByValue(optionsEl, value) {
    value = value.toLowerCase();

    qa(optionsEl, '[data-r="option"]').forEach(optionEl => {
        if (value) {
            if (fuzzysearch(value, optionEl.innerText.toLowerCase())) {
                removeClass(optionEl, 'hidden')
            }
            else {
                addClass(optionEl, 'hidden')
            }
        }
        else {
            removeClass(optionEl, 'hidden')
        }
    })
}

function resolveOptionsEl(optionsElOrId) {
    if (typeof optionsElOrId == 'string') {
        return q(`#${optionsElOrId}`);
    }
    return optionsElOrId;
}

export default {
    init() {

        // Fokusējot options elementu, ja tajā ir search field, tad tas tiek fokusēts
        on('focusin', '.options', (ev, el) => {
            // Reaģējam tikai, ja pats .options el dabū fokusu
            if (is(ev.target, '.options')) {
                if (r(el).fieldSearch) {
                    q(r(el).fieldSearch, 'input').focus();
                }
            }
        })

        on('keydown', '.options', (ev, optionsEl) => {
            switch (ev.key) {
                case 'Enter':
                    if ('isInPanel' in optionsEl.dataset) {
                        ev.preventDefault();

                        if (closeCb) {
                            closeCb();
                        }
                    }
                    break;
                case 'Escape':
                case 'Tab':
                    if ('isInPanel' in optionsEl.dataset) {
                        ev.preventDefault();
                        if (closeCb) {
                            closeCb();
                        }
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    ev.preventDefault();
                    nextOption(optionsEl);

                    if ('isInPanel' in optionsEl.dataset) {
                        if (selectOptionCb) {
                            selectOptionCb(getChecked(optionsEl));
                        }
                    }
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    ev.preventDefault();
                    prevOption(optionsEl);

                    if ('isInPanel' in optionsEl.dataset) {
                        if (selectOptionCb) {
                            selectOptionCb(getChecked(optionsEl));
                        }
                    }
                    break;
            }
        });

        // Options click
        clickp('.options [data-r="option"]', (ev, optionEl) => {
            let optionsEl = parent(optionEl, '[data-is-container]');
            let currentOptionEl = getChecked(optionsEl);

            uncheck(currentOptionEl);
            check(optionEl);


            if (selectOptionCb) {
                selectOptionCb(optionEl);
            }
        })

        on('click', 'html', ev => {
            if (closeCb) {
                if (isPanelOpen) {
                    if (!isChild(ev.target, SingletonPanel.getEl())) {
                        closeT = setTimeout(() => closeCb(), 50)
                    }
                }
            }
        });

        // unchecked checked and set checked currently hovered
        /**
         * TODO Sito laikam vajag tikai, ja ir FieldSelect režīms
         */
        // on('mouseover', '.options [data-r="option"]', (ev, optionEl) => {
        //     uncheck(getChecked(parent(optionEl, '[data-is-container]')));
        //     check(optionEl);
        // })

        on('keyup', '.options [data-r="fieldSearch"]', (ev, el) => {
            filterOptionsByValue(parent(el, '[data-is-container]'), q(el, 'input').value)
        })
    },

    open(optionsElOrId, options = {}) {
        optionsElOrId = resolveOptionsEl(optionsElOrId);

        open(optionsElOrId, options);
    },

    close(optionsElOrId) {
        optionsElOrId = resolveOptionsEl(optionsElOrId);

        close(optionsElOrId);
    },

    findOptionByValue(optionsElOrId, value) {
        optionsElOrId = resolveOptionsEl(optionsElOrId);

        return findOptionByValue(optionsElOrId, value)
    },

    nextOption(optionsElOrId) {
        return nextOption(resolveOptionsEl(optionsElOrId));
    },

    prevOption(optionsElOrId) {
        return prevOption(resolveOptionsEl(optionsElOrId));
    }
}