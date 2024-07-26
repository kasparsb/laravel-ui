import {q, qa, parent, append, click, on, onMouseOverOut, clearFormData} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';
import SingletonPanel from './SingletonPanel';
import Listeners from './helpers/Listeners';

let isOpen = false;
let dropDownMenuHideTimeout = 0;
// default event, kad slēpt menu
let menuHideOn;

let onOpenListeners = {};

/**
 * Menu sastaiste ar trigger elementu, kurš atvēra menu
 * menu name -> triggerEl
 */
let menuOpenTriggers = {}

function findDropdownMenuByName(name) {
    return q('[data-dropdown-menu-name="'+name+'"]');
}

function findDropdownMenuByChild(childEl) {
    return parent(childEl, '[data-dropdown-menu-name]');
}

function triggerMenuOpenListeners(menuEl) {
    let menuName = menuEl.dataset.dropdownMenuName;

    if (onOpenListeners[menuName]) {
        onOpenListeners[menuName].trigger([
            menuEl,
            menuOpenTriggers[menuName]
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

            triggerMenuOpenListeners(menuEl);
        },
        onContentElRemove(menuEl) {
            menuEl.hidden = true;

            delete menuEl.dataset.dropdownMenuPanelIndex;

            // Atrodam click trigger un novācam pazīmi, ka menu ir atvērts
            if (typeof menuOpenTriggers[menuEl.dataset.dropdownMenuName] != 'undefined') {
                delete menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuOpen
                delete menuOpenTriggers[menuEl.dataset.dropdownMenuName]
            }

            // append back to body, jo var būt vairāki menu un tos meklēs body
            append(q('body'), menuEl);
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
    let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger)
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

    let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
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

    let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
    if (!menuEl) {
        return
    }

    SingletonPanel.closeOnMouseOut(menuEl.dataset.dropdownMenuPanelIndex);
}

function handleMenuCloseOnFocusOut(triggerEl) {
    if (!triggerEl.dataset.dropdownMenuOpen) {
        return;
    }

    let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
    if (!menuEl) {
        return
    }

    SingletonPanel.closeOnMouseFocusOut(menuEl.dataset.dropdownMenuPanelIndex);
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
                    menuToClose = findDropdownMenuByName(clickTriggerEl.dataset.dropdownMenuHide);
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

        // Focusin
        on('focusin', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            triggerEl.dataset.wasFocusIn = '';
            handleMenuOpenTrigger(triggerEl, true)

        })
        // Ja ir iefokusēts, tad atkārtoti nevarēs atvērt, tāpēc ir vēl click
        click('[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            if (('wasFocusIn' in triggerEl.dataset)) {
                delete triggerEl.dataset.wasFocusIn;
            }
            else {
                toggleOpenOnTriggerEl(triggerEl)
            }
        })
        on('focusout', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            if (triggerEl.dataset.dropdownMenuHide == 'onclick.outside') {

            }
            else {
                handleMenuCloseOnFocusOut(triggerEl)
            }
        })


        // Escape close
        on('keyup', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            let menuEl;
            switch (ev.key) {
                case 'Escape':
                    menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger)
                    SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
                    break;
                case 'Enter':
                    toggleOpenOnTriggerEl(triggerEl)
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

    /**
     * Pēc padotā element atrodam dropdown menu, kurā tas atrodas
     */
    getByChild(childEl) {
        return findDropdownMenuByChild(childEl)
    },

    getByName(name) {
        return findDropdownMenuByName(name)
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
    }
}