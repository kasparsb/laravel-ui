import {
    q, qa,
    next, prev,
    parent, on, clickp,
    dispatchEvent,
    get,
    replaceContent, append
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

    // Ja ir sourceUrl
    if (optionsEl.dataset.sourceUrl) {
        loadOptionsFromUrl(optionsEl, optionsEl.dataset.sourceUrl, value);
    }
    else {
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

        updateState(optionsEl);
    }
}

/**
 * Kad options list atrodas Dropdown menu, tad
 * atrodam to un tā openTriggerEl
 * openTriggerEl būs tas, kurā ielikt izvēlēto options
 */
function findFieldValue(optionsEl) {
    return q(DropdownMenu.getOpenTriggerByChild(optionsEl), 'input');
}

function setFieldValue(optionsEl, selectedOptionEl) {
    let fieldValue = findFieldValue(optionsEl);
    fieldValue.value = selectedOptionEl.dataset.value;
    dispatchEvent(fieldValue, 'change');
}

function getFieldValue(optionsEl) {
    let fieldValue = findFieldValue(optionsEl);
    return fieldValue.value
}

function cleanUp(optionsEl, fieldValue) {
    let searchInputEl = q(optionsEl, '[data-field-select-search-field]');
    if (searchInputEl) {
        searchInputEl.value = '';
        filterOptionsByValue(optionsEl, searchInputEl.value)
    }

    // Uncheck all
    qa(optionsEl, '[data-options-list-option]').forEach(optionEl => {
        uncheck(optionEl);
    })

    // check by field value
    check(findOptionByValue(optionsEl, fieldValue.value));
}

function updateState(optionsEl) {
    // Pārbaudām vai ir options
    optionsEl.dataset.state = '';
    if (!q(optionsEl, '[data-options-list-option]:not([hidden])')) {
        optionsEl.dataset.state = 'empty';
    }
}

let counter = 0;
function loadOptionsFromUrl(optionsEl, url, searchQuery) {

    let params = {};
    if (searchQuery) {
        params.q = searchQuery;
    }

    get(url, params)
        .then(html => {

            q(optionsEl, '[role="list"]').innerHTML = html;
            // Meklējam vai ir pieejams pagination tieši priekš options list
            let paginationEl = q(optionsEl, '[role="list"] [data-options-pagination]');

            if (paginationEl) {
                optionsEl.dataset.hasPagination = '';
                let paginationContainerEl = q(optionsEl, '[data-field-select-pagination]');

                /**
                 * Pagination bija fokusā. Kad notiek paginationEl replace, tad fokuss pazūd
                 * un Dropdown menu gadījumā dropdown menu aizveras ciet, jo notika focusout
                 * !šitas it kaut kāds fakaps, kuru īsti nesaprotu kā parezi būtu risināt
                 * būtu, labi, ja fokusā paliku tas pats page, kurš bija pirms replace
                 *
                 * Pateiksim DropdownMenu, lai ignorē focusout
                 */

                // Vai esam DropdownMenu
                let menuEl = DropdownMenu.getByChild(optionsEl);
                if (menuEl) {
                    DropdownMenu.ignoreFocusoutOnce(menuEl);
                }

                replaceContent(paginationContainerEl, paginationEl)
            }
            else {
                delete optionsEl.dataset.hasPagination;
            }
            updateState(optionsEl);
        })
}

export default {
    init() {


        // Uzliek sākuma state
        qa('.options').forEach(optionsEl => {
            updateState(optionsEl);
        });

        /**
         * TODO Dropdown uz atvēršanu focus first input
         * tas lai search lauks tiktu uzreiz iefokusēts
         */

        /**
         * Klausāmies uz visiem dropdown menu close
         * apstrādājam tikai Options menu
         */
        DropdownMenu.onCloseAny((menuEl, fieldValue) => {
            /**
             * TODO pārtaisīt Dropdown menu, lai visi properties ir
             * uz contentEl nevis floating-container
             * Tāpēc šeit ir quickfix, lai iegūtu īsto menu el
             */
            let contentEl = q(menuEl, '[data-dropdown-menu-content-el]');
            if (!('fieldSelectOptionsMenu' in contentEl.dataset)) {
                return;
            }

            /**
             * Varbūt cleanup vajag izsaukt nevis uzreiz kad aizver, bet nedaudz vēlāk
             * Piemēram ir garš lapojam saraksts, kurā izvēlies vērtību. Saproti, ka
             * nepareizā, atver un saraksts ir notīrīts. Vajag atkal skrollēt un meklēt
             */
            cleanUp(q(contentEl, '.options'), fieldValue)
        })

        DropdownMenu.onOpenAny((menuEl, fieldValue) => {
            /**
             * TODO pārtaisīt Dropdown menu, lai visi properties ir
             * uz contentEl nevis floating-container
             * Tāpēc šeit ir quickfix, lai iegūtu īsto menu el
             */
            let contentEl = q(menuEl, '[data-dropdown-menu-content-el]');
            if (!('fieldSelectOptionsMenu' in contentEl.dataset)) {
                return;
            }

            let optionsEl = q(contentEl, '.options');
            if (!optionsEl.dataset.sourceUrl) {
                return
            }

            if ('optionsIsLoaded' in optionsEl.dataset) {
                return
            }

            // Load items from sourceUrl
            optionsEl.dataset.optionsIsLoaded = '';
            loadOptionsFromUrl(optionsEl, optionsEl.dataset.sourceUrl);
        })

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

            // Ignorējam
            switch (ev.key) {
                case 'Enter':
                case 'ArrowUp':
                case 'ArrowDown':
                    return;
            }

            let optionsEl = parent(inputEl, '.options');
            if ('ignoreFirstKeyup' in optionsEl.dataset) {
                delete optionsEl.dataset.ignoreFirstKeyup;
            }
            else {
                filterOptionsByValue(optionsEl, inputEl.value)
            }
        })

        // Pagination
        clickp('.options [data-field-select-pagination] a', (ev, linkEl) => {
            let optionsEl = parent(linkEl, '.options');
            loadOptionsFromUrl(optionsEl, linkEl.href);
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