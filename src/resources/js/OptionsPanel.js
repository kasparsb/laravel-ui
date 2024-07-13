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
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});
    // Ja ir izfiltrēts
    if (is(currentOptionEl, '.hidden')) {
        // uncheck
        uncheck(currentOptionEl);
        // un uzskatās, ka nav atrasts
        currentOptionEl = null;
    }
    if (currentOptionEl) {
        let nextEl = next(currentOptionEl, '[data-r="option"]:not(.hidden)');
        if (nextEl) {
            uncheck(currentOptionEl);
            return check(nextEl);
        }
        return currentOptionEl;
    }
    else {
        return check(first(qa(optionsEl, '[data-r="option"]:not(.hidden)')), optionsEl);
    }
}

function prevOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});
    // Ja ir izfiltrēts
    if (is(currentOptionEl, '.hidden')) {
        // uncheck
        uncheck(currentOptionEl);
        // un uzskatās, ka nav atrasts
        currentOptionEl = null;
    }
    if (currentOptionEl) {
        let prevEl = prev(currentOptionEl, '[data-r="option"]:not(.hidden)');
        if (prevEl) {
            uncheck(currentOptionEl);
            return check(prevEl);
        }
        return currentOptionEl;
    }
    else {
        return check(last(qa(optionsEl, '[data-r="option"]:not(.hidden)')));
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
         * Fokusēšana
         * ja ir search field, tad foksuējam to
         */
        if (r(optionsEl).fieldSearch) {
            /**
             * Interesants efekts, kad panel atver uz keydown, tad notiek
             * šī lauka fokusēšana un šim pašam laukam atkal ir keyUp events
             * un sanāk, ka pēc fokusēšanas tas dabū keyUp event, jo ir foksusā
             */
            optionsEl.dataset.ignoreFirstKeyup = '';
            q(r(optionsEl).fieldSearch, 'input').focus();
        }
        else {
            optionsEl.focus();
        }
    }, 5)
}

function close(optionsEl) {
    // Ja panelī ir norādītais optionsEl, tad close
    if (optionsEl == SingletonPanel.getContentEl()) {
        SingletonPanel.close();

        // Notīrām search query
        if (r(optionsEl).fieldSearch) {
            q(r(optionsEl).fieldSearch, 'input').value = '';
        }

        // Atslēpjam hidden options
        qa(optionsEl, '[data-r="option"]').forEach(optionEl => {
            removeClass(optionEl, 'hidden')
        });
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

        // Filtrēšana
        on('keyup', '.options [data-r="fieldSearch"]', (ev, el) => {
            let optionsEl = parent(el, '[data-is-container]');
            if ('ignoreFirstKeyup' in optionsEl.dataset) {
                delete optionsEl.dataset.ignoreFirstKeyup;
            }
            else {
                filterOptionsByValue(optionsEl, q(el, 'input').value)
            }
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