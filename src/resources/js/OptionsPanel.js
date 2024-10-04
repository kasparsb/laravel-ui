import {
    q, qa,
    next, prev,
    parent, on, clickp,
    dispatchEvent,
    get,
    replaceContent, getOffset, getOuterDimensions
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

function firstOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});

    let options = qa(optionsEl, '[data-options-list-option]:not([hidden])');
    if (options.length > 0) {
        let firstEl = options[0];

        if (currentOptionEl) {
            uncheck(currentOptionEl);
        }

        let r = check(firstEl);
        scrollCheckedIntoViewport(optionsEl);
        return r;
    }
}

function lastOption(optionsEl) {
    let currentOptionEl = getChecked(optionsEl, {ignoreHiden: true});

    let options = qa(optionsEl, '[data-options-list-option]:not([hidden])');
    if (options.length > 0) {
        let lastEl = options[options.length - 1];

        if (currentOptionEl) {
            uncheck(currentOptionEl);
        }

        let r = check(lastEl);
        scrollCheckedIntoViewport(optionsEl);
        return r;
    }
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
            let r = check(nextEl);
            scrollCheckedIntoViewport(optionsEl);
            return r;
        }
        else {
            return currentOptionEl;
        }
    }
    else {
        let r = check(first(qa(optionsEl, '[data-options-list-option]:not([hidden])')), optionsEl);
        scrollCheckedIntoViewport(optionsEl);
        return r;
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
            let r = check(prevEl);
            scrollCheckedIntoViewport(optionsEl);
            return r;
        }
        else {
            return currentOptionEl;
        }
    }
    else {
        let r = check(last(qa(optionsEl, '[data-options-list-option]:not([hidden])')));
        scrollCheckedIntoViewport(optionsEl);
        return r;
    }
}

function scrollCheckedIntoViewport(optionsEl) {
    let checkedEl = getChecked(optionsEl, {ignoreHiden: true});
    if (!checkedEl) {
        return;
    }

    let padding = 4;

    let listEl = q(optionsEl, '[data-field-select-options-container]');

    let checkedElOffset = getOffset(checkedEl);
    let checkedElDimensions = getOuterDimensions(checkedEl);

    let listElOffset = getOffset(listEl);
    let listElDimensions = getOuterDimensions(listEl);

    let checkedElTopOffset = checkedElOffset.top - listElOffset.top;
    let checkedElBottomOffset = checkedElTopOffset + checkedElDimensions.height;

    // Iet ārpuse viewport uz augšu
    if (checkedElTopOffset < 0) {
        scrollViewportTo(optionsEl, listEl.scrollTop + checkedElTopOffset - padding)
    }
    // Iet ārpuse viewport uz leju
    else if (checkedElBottomOffset > listElDimensions.height) {
        scrollViewportTo(optionsEl, listEl.scrollTop + (checkedElBottomOffset - listElDimensions.height) + padding);
    }
}

function scrollViewportTo(optionsEl, top) {
    let listEl = q(optionsEl, '[data-field-select-options-container]')
    listEl.scrollTo(0, top);
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
        // Set scroll top uz 0
        q(optionsEl, '[role=list]').scrollTo(0, 0);

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
    check(findOptionByValue(optionsEl, q(fieldValue, 'input').value))
}

function updateState(optionsEl) {
    // Pārbaudām vai ir options
    let state = '';


    // Notiek datu ielāde
    if ('isLoading' in optionsEl.dataset) {
        state = 'loading';
    }
    else if (!q(optionsEl, '[data-options-list-option]:not([hidden])')) {
        state = 'empty';
    }

    optionsEl.dataset.state = state;
}

function loadOptionsFromUrl(optionsEl, url, searchQuery) {

    if (!url) {
        return;
    }

    // Scroll to top
    scrollViewportTo(optionsEl, 0);

    optionsEl.dataset.isLoading = '';
    updateState(optionsEl);



    let params = {};
    if (searchQuery) {
        params.q = searchQuery;
    }

    get(url, params)
        .then(html => {

            q(optionsEl, '[role="list"]').innerHTML = html;
            // Set scroll top uz 0
            q(optionsEl, '[role=list]').scrollTo(0, 0);

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

                /**
                 * Vajag saprast, kurš no pagination linkiem ir fokusā,
                 * lai var atjaunot fokusu tam pašam linkam
                 * pēc tam, kad ir nomainīts paginationEl
                 */
                let lastPaginationButtonName;
                if (document.activeElement && document.activeElement.dataset.paginationButtonName) {
                    lastPaginationButtonName = document.activeElement.dataset.paginationButtonName;
                }

                replaceContent(paginationContainerEl, paginationEl)

                // Atjaunojam fokusu
                if (lastPaginationButtonName) {
                    let newPaginationButtonEl = q(paginationEl, `[data-pagination-button-name=${lastPaginationButtonName}]`)
                    if (newPaginationButtonEl) {
                        newPaginationButtonEl.dataset.disableColorTransition = '';
                        newPaginationButtonEl.focus();
                        delete newPaginationButtonEl.dataset.disableColorTransition;
                    }
                }
            }
            else {
                delete optionsEl.dataset.hasPagination;
            }

            delete optionsEl.dataset.isLoading;

            updateState(optionsEl);

            optionsEl.dataset.optionsLoaded = '';
        })
}

export default {
    init() {


        // Uzliek sākuma state
        qa('.field-select .options').forEach(optionsEl => {

            // Ja ir datasource url un nav ielādēti, tad state liekam kā loading
            if ('sourceUrl' in optionsEl.dataset) {
                if (!('optionsIsLoaded' in optionsEl.dataset)) {
                    optionsEl.dataset.isLoading = '';
                }
            }

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

            if ('optionsLoaded' in optionsEl.dataset) {
                return
            }

            // Load items from sourceUrl
            loadOptionsFromUrl(optionsEl, optionsEl.dataset.sourceUrl);
        })


        on('keydown', '.options', (ev, optionsEl) => {

            switch (ev.key) {
                case 'Enter':

                    /**
                     * TODO jāpārtaisa, lai Enter events nāktu tieši no Option
                     * tas nozīmē, ka vajag options taisīt fokusējamus
                     * pašlaik tie nav fokusējami. Aktīvais un nākošais/prev tiek
                     * noteikts pēc css klases
                     */

                    // Ja ir search field, tad neveram ciet
                    if ('fieldSelectSearchField' in ev.target.dataset) {
                        return;
                    }

                    // Ja ir [data-field-select-pagination] neveram ciet
                    if (parent(ev.target, '[data-field-select-pagination]')) {
                        return;
                    }

                    // Ja ir empty state elementā, tad skip
                    if (parent(ev.target, '[data-field-select-empty-state]')) {
                        return;
                    }

                    DropdownMenu.close(DropdownMenu.getByChild(optionsEl))

                    break;
                /**
                 * TODO jauca ar search field home un end
                 */
                case 'Home':
                    if ('fieldSelectSearchField' in ev.target.dataset) {
                        return;
                    }

                    ev.preventDefault();
                    setFieldValue(optionsEl, firstOption(optionsEl))

                    break;
                case 'End':
                    if ('fieldSelectSearchField' in ev.target.dataset) {
                        return;
                    }

                    ev.preventDefault();
                    setFieldValue(optionsEl, lastOption(optionsEl))

                    break;
                case 'ArrowDown':
                    ev.preventDefault();

                    q(optionsEl, '[role=list]').focus();
                    setFieldValue(optionsEl, nextOption(optionsEl))

                    break;
                case 'ArrowUp':
                    ev.preventDefault();

                    q(optionsEl, '[role=list]').focus();
                    setFieldValue(optionsEl, prevOption(optionsEl))

                    break;
            }

            /**
             * Novācam foksus no pagination pogas
             */
            switch (ev.key) {
                case 'Home':
                case 'End':
                case 'ArrowDown':
                case 'ArrowUp':
                    if (document.activeElement) {
                        /**
                         * TODO tagad nevar iefokusēt .options, var tikai search field
                         * varbūt, ka ir search field, tad to fokusēt
                         * sanāk, ka tad, kad pāriet uz options list, tad no pagination
                         * pazūd fokuss tas aiziet uz options kontrolēšanu (search + up down arrows)
                         */
                        // if (parent(document.activeElement, '[data-field-select-pagination]')) {
                        //     optionsEl.focus();
                        // }
                    }
            }
        });

        // Filtrēšana
        let prevSearchFieldValue = '';
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
                if (prevSearchFieldValue != inputEl.value) {
                    prevSearchFieldValue = inputEl.value;
                    filterOptionsByValue(optionsEl, inputEl.value)
                }
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
    },

    firstOption(optionsEl) {
        return firstOption(optionsEl);
    },

    lastOption(optionsEl) {
        return lastOption(optionsEl);
    }
}