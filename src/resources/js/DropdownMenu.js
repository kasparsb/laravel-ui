import {q, qa, parent, next, append, click, on, onMouseOverOut, clearFormData} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';
import SingletonPanel from './SingletonPanel';
import Listeners from './helpers/Listeners';

let isOpen = false;
let dropDownMenuHideTimeout = 0;
// default event, kad slēpt menu
let menuHideOn;

let onOpenListeners = {};
let onCloseListeners = {};

/**
 * Menu sastaiste ar trigger elementu, kurš atvēra menu
 * menu name -> triggerEl
 */
let menuOpenTriggers = {}

let menuNameCounter = 0;

function findDropdownMenuEl(triggerEl) {
    // nākošais sibling no triggerEl
    if (triggerEl.dataset.dropdownMenuTrigger == 'dom.nextSibling') {
        return next(triggerEl, '.dropdown-menu');
    }
    else {
        return findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger)
    }
}

function findDropdownMenuByName(name) {
    return q('[data-dropdown-menu-name="'+name+'"]');
}

function findDropdownMenuByChild(childEl) {
    return parent(childEl, '[data-dropdown-menu-name]');
}

/**
 * Šeit arī tiks pārbaudīts vai triggerEl ir izveidots menu name
 */
function findDropdown(triggerEl) {
    let menuEl = findDropdownMenuEl(triggerEl);

    // Ģenerējam unikālu name
    if (!menuEl.dataset.dropdownMenuName) {
        menuEl.dataset.dropdownMenuName = 'dropdown-menu-'+(menuNameCounter++)
        triggerEl.dataset.dropdownMenuTrigger = menuEl.dataset.dropdownMenuName;
    }

    return menuEl;
}

function triggerMenuOpenListeners(menuEl, menuOpenTriggerEl) {
    let menuName = menuEl.dataset.dropdownMenuName;

    if (onOpenListeners[menuName]) {
        onOpenListeners[menuName].trigger([
            menuEl,
            menuOpenTriggerEl
        ])
    }
}

function triggerMenuCloseListeners(menuEl, menuOpenTriggerEl) {
    let menuName = menuEl.dataset.dropdownMenuName;

    if (onCloseListeners[menuName]) {
        onCloseListeners[menuName].trigger([
            menuEl,
            menuOpenTriggerEl
        ])
    }
}

/**
 * Vai padotais dropdown menu ir atvērts
 */
function isDropdownMenuOpen(menuEl) {
    if ('dropdownMenuPanelIndex' in menuEl.dataset) {
        return true;
    }

    return false
}

function open(clickTriggerEl, menuEl, clickOutsideIgnoreEl) {

    // Notīrām hide timeout
    clearTimeout(dropDownMenuHideTimeout);

    SingletonPanel.open(menuEl, {
        onOpen(menuEl, panelIndex) {
            menuEl.dataset.dropdownMenuPanelIndex = panelIndex;
            menuEl.hidden = false;

            /**
             * Pazīmi, ka menu atvērts liekam uz triggerEl, jo
             * dažādi trigger el var atvērt vienu un to pašu menu
             */
            clickTriggerEl.dataset.dropdownMenuOpen = '1';

            // Menu name sasaiste ar open trigger
            menuOpenTriggers[menuEl.dataset.dropdownMenuName] = clickTriggerEl;

            triggerMenuOpenListeners(menuEl, clickTriggerEl);
        },
        onContentElRemove(menuEl) {
            menuEl.hidden = true;

            delete menuEl.dataset.dropdownMenuPanelIndex;

            let menuOpenTriggerEl;
            // Atrodam click trigger un novācam pazīmi, ka menu ir atvērts
            if (typeof menuOpenTriggers[menuEl.dataset.dropdownMenuName] != 'undefined') {

                menuOpenTriggerEl = menuOpenTriggers[menuEl.dataset.dropdownMenuName];

                delete menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuOpen
                delete menuOpenTriggers[menuEl.dataset.dropdownMenuName]
            }

            // append back to body, jo var būt vairāki menu un tos meklēs body
            append(q('body'), menuEl);

            triggerMenuCloseListeners(menuEl, menuOpenTriggerEl);

            // Atrkārtoti iefokusējam triggerEl
            if ('dropdownMenuRefocus' in menuOpenTriggerEl.dataset) {
                // šis noignorēs focusin, lai atkāŗtoti menu neatveras uz focusin
                menuOpenTriggerEl.dataset.dropdownIgnoreFocusin = ''
                menuOpenTriggerEl.focus();
            }
        },
        triggerEl: clickTriggerEl,
        side: menuEl.dataset.side,
        align: menuEl.dataset.align,

        // Kad aizvērt onclick.outside | onmouseout
        closeWhen: clickTriggerEl.dataset.dropdownMenuHide,

        clickOutsideIngoredEl: clickOutsideIgnoreEl,
    });




    // Reset form
    if ('dropdownMenuResetForm' in clickTriggerEl.dataset) {
        clearFormData(menuEl);
    }
}

function setOverrideFromOpenTriggerEl(openTriggerEl, menuEl) {

    // Menu hide events (onclick.outside vai onmouseout)
    menuHideOn = openTriggerEl.dataset.dropdownMenuHide;

    // Attributes
    qa(menuEl, '[data-role="menuitem"]').forEach(menuItemEl => {

        if (menuItemEl.dataset.linkSource) {
            menuItemEl.setAttribute('href', openTriggerEl.getAttribute(menuItemEl.dataset.linkSource))
            if (ButtonDelete.isButtonDelete(menuItemEl)) {
                menuItemEl.setAttribute('data-url', openTriggerEl.getAttribute(menuItemEl.dataset.linkSource))
            }
        }

        if (menuItemEl.dataset.redirectSource) {
            menuItemEl.setAttribute('data-redirect', openTriggerEl.getAttribute(menuItemEl.dataset.redirectSource))
        }

    })
}

function toggleOpenOnTriggerEl(triggerEl) {
    let menuEl = findDropdown(triggerEl)
    if (isDropdownMenuOpen(menuEl)) {
        SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
    }
    else {
        handleMenuOpenTrigger(triggerEl)
    }
}

/**
 * Menu open trigger apstrādē (click vai hover)
 */
function handleMenuOpenTrigger(triggerEl, clickOutsideIgnoreEl) {
    if (triggerEl.dataset.dropdownMenuOpen) {
        return;
    }

    let menuEl = findDropdown(triggerEl);
    if (!menuEl) {
        return
    }

    setOverrideFromOpenTriggerEl(triggerEl, menuEl);
    open(triggerEl, menuEl, clickOutsideIgnoreEl ? triggerEl : null);
}

function handleMenuCloseOnMouseOut(triggerEl) {
    if (!triggerEl.dataset.dropdownMenuOpen) {
        return;
    }

    let menuEl = findDropdown(triggerEl);
    if (!menuEl) {
        return
    }

    SingletonPanel.closeOnMouseOut(menuEl.dataset.dropdownMenuPanelIndex);
}

function handleMenuCloseOnFocusOut(triggerEl) {
    if (!triggerEl.dataset.dropdownMenuOpen) {
        return;
    }

    let menuEl = findDropdown(triggerEl);
    if (!menuEl) {
        return
    }

    SingletonPanel.closeOnFocusOut(menuEl.dataset.dropdownMenuPanelIndex);
}

function handleMenuCloseOnFocusOutAndFocusFirst(ev, triggerEl) {
    if (!triggerEl.dataset.dropdownMenuOpen) {
        return;
    }

    let menuEl = findDropdown(triggerEl);
    if (!menuEl) {
        return
    }

    SingletonPanel.closeOnFocusOutOrFocusFirst(menuEl.dataset.dropdownMenuPanelIndex, {
        focusFirst() {
            ev.preventDefault();
            // Kad menu tiks aizvērts, tad atkārtoti iefokusēt triggerEl
            triggerEl.dataset.dropdownMenuRefocus = ''
        },
        close() {

        }
    });
}

export default {
    init() {
        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]', (ev, clickTriggerEl) => {
            handleMenuOpenTrigger(clickTriggerEl)
        })

        // Menu hide. Tikai tie, kuriem uzlikta iespēja tikai aizvērt menu
        click('[data-dropdown-menu-hide]', (ev, clickTriggerEl) => {
            // Ja ir dropdownMenuTrigger, tad ignorējam click
            // ja šīs atver menu, tad nereaģējam
            if (clickTriggerEl.dataset.dropdownMenuTrigger) {
                return
            }

            // Atrodam menu kuru aizvērt
            let menuToClose;
            switch (clickTriggerEl.dataset.dropdownMenuHide) {
                case '_container':
                    menuToClose = findDropdownMenuByChild(clickTriggerEl);
                    break;
                default:
                    menuToClose = findDropdown(clickTriggerEl);
            }

            SingletonPanel.close(menuToClose.dataset.dropdownMenuPanelIndex);
        })

        // Menu item click
        on('click', '[data-dropdown-menu-name] .menu-item', (ev, menuItemEl) => {
            let menuToClose = findDropdownMenuByChild(menuItemEl)
            SingletonPanel.close(menuToClose.dataset.dropdownMenuPanelIndex);
        });

        onMouseOverOut('[data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]', {
            mouseover(ev, hoverTriggerEl) {
                handleMenuOpenTrigger(hoverTriggerEl);
            }
        })

        onMouseOverOut('[data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]', {
            mouseout(ev, hoverTriggerEl) {
                handleMenuCloseOnMouseOut(hoverTriggerEl)
            }
        })


        /**
         * focusin un click abi izpildās
         * Click izpildās lēnāk, atkarībā no tā cik ātri lietotājs kliksķina
         * kamēŗ mousdown tikmēr click nenotiek, bet focusin jau notiek
         * Problēma: vajag parādīt menu gan uz focusin, gan arī tad, ja lauks jau ir focusin, tad
         * uz mouse click varī vajag parādīt
         * Tā kā focusi un click notiek secīgi, tad notiek divas reizes parādīšana
         * Tāpēc izmanotjam mousedown, lai noteiktu pēc iespējas ātrāk vai bija mouse click
         *
         * tiek pieņemts, ka mousedown notik pirms focusin
         */
        // Focusin
        on('mousedown', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            triggerEl.dataset.dropdownIgnoreFocusin = '';
        })
        on('focusin', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            if ('dropdownIgnoreFocusin' in triggerEl.dataset) {
                delete triggerEl.dataset.dropdownIgnoreFocusin
                return;
            }
            // Pazīme, ka šis bija focusin
            //triggerEl.dataset.dropdowMenuWasFocused = '';
            handleMenuOpenTrigger(triggerEl, true)
        })
        // Ja ir iefokusēts, tad atkārtoti nevarēs atvērt, tāpēc ir vēl click
        click('[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            // Pazīme, ka šis bija focusin
            //triggerEl.dataset.dropdowMenuWasFocused = '';
            toggleOpenOnTriggerEl(triggerEl)
        })



        /**
         * Situācija, kad panelī atvērts otrs panelis
         * Ja ir Escape uz paneļa, tad to aizver ciet
         * bet ja ir escape uz triggerEl, kurš ir panelī,
         * tad vajag, lai nostrādā tikai triggerEl atvērtā paneļa aizvēršana
         * Pirmo ķeram escape uz panel un lieka timeout
         * ja ir bijis escape uz triggerEl, tad panel close timeout tiks atcelts
         */
        let escapeOnDropdownTimeout = 0;

        // Escape in dropdownmenu
        on('keydown', '[data-dropdown-menu-name]', (ev, menuEl) => {
            switch (ev.key) {
                case 'Escape':
                    escapeOnDropdownTimeout = setTimeout(() => {
                        SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
                    }, 20)
                    break;
            }
        });

        // Escape on open trigger
        on('keydown', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            let menuEl;
            switch (ev.key) {
                case 'Escape':
                    menuEl = findDropdown(triggerEl)
                    // Ja triggerEl menu ir atvērts
                    if (isDropdownMenuOpen(menuEl)) {
                        clearTimeout(escapeOnDropdownTimeout);
                        SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
                    }
                    break;
                case 'Enter':
                    // Atceļa, jo Enter trigero form submit
                    ev.preventDefault();
                    toggleOpenOnTriggerEl(triggerEl)
                    break;
                case 'Tab':
                    if (ev.shiftKey) {
                        handleMenuCloseOnFocusOut(triggerEl)
                    }
                    else {
                        handleMenuCloseOnFocusOutAndFocusFirst(ev, triggerEl)
                    }
                    break;
            }
        });
    },

    /**
     * Aizveram DropdownMenu
     */
    close(menuToClose) {
        if (menuToClose) {
            if (isDropdownMenuOpen(menuToClose)) {
                SingletonPanel.close(menuToClose.dataset.dropdownMenuPanelIndex);
            }
        }
    },

    closeByName(menuName) {
        this.close(findDropdownMenuByName(menuName));
    },

    closeByOpenTrigger(triggerEl) {
        for (let [menuName, openTriggerEl] of Object.entries(menuOpenTriggers)) {
            if (openTriggerEl === triggerEl) {
                this.close(findDropdownMenuByName(menuName));
            }
        }
    },

    /**
     * Pēc padotā element atrodam dropdown menu, kurā tas atrodas
     */
    getByChild(childEl) {
        return findDropdownMenuByChild(childEl)
    },

    getByName(name) {
        return findDropdownMenuByName(name)
    },

    getMenuEl(triggerEl) {
        return findDropdownMenuEl(triggerEl);
    },

    getOpenTrigger(menuEl) {
        if (isDropdownMenuOpen(menuEl)) {
            return menuOpenTriggers[menuEl.dataset.dropdownMenuName];
        }
    },

    getOpenTriggerByChild(childEl) {
        let dropdownMenuEl = findDropdownMenuByChild(childEl);
        if (dropdownMenuEl && isDropdownMenuOpen(dropdownMenuEl)) {
            return menuOpenTriggers[dropdownMenuEl.dataset.dropdownMenuName];
        }
    },

    onOpen(menuName, cb) {
        if (typeof onOpenListeners[menuName] == 'undefined') {
            onOpenListeners[menuName] = new Listeners();
        }
        onOpenListeners[menuName].listen(cb);
    },

    onClose(menuName, cb) {
        if (typeof onCloseListeners[menuName] == 'undefined') {
            onCloseListeners[menuName] = new Listeners();
        }
        onCloseListeners[menuName].listen(cb);
    }
}