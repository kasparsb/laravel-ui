import {
    q, qa, parent, next, append, is,
    click, on, off, onMouseOverOut,
    clearFormData
} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';
import SingletonPanel from './SingletonPanel';
import Listeners from './helpers/Listeners';

let dropDownMenuHideTimeout = 0;

let onOpenListeners = {};
let onCloseListeners = {};

// timeouts by panelIndex
let focusoutTimeout = {};

/**
 * Menu sastaiste ar trigger elementu, kurš atvēra menu
 * menu name -> triggerEl
 */
let menuOpenTriggers = {}

let menuNameCounter = 0;

function findFirstFocusable(el) {
    let candidates  = qa(el, 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    for (let i = 0; i < candidates.length; i++) {
        // Jāpārbauda vai tabindex ir -1
        if (candidates[i].tabIndex < 0) {
            continue;
        }

        return candidates[i];
    }
}

/**
 * Pirmo fokusējam pirmo pieejamo focusable elementu,
 * ja tā nav, tad fokusējam pašu menu
 */
function focusMenu(menuEl, whatToFocus) {
    let focusableEl;

    // querySelector priekš focus elementa
    if (whatToFocus) {
        focusableEl = q(menuEl, whatToFocus);
    }

    if (!focusableEl) {
        focusableEl = findFirstFocusable(menuEl);
    }

    if (!focusableEl) {
        focusableEl = menuEl;
    }

    focusableEl.focus();

    return focusableEl;
}

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

    if (menuEl) {
        // Ģenerējam unikālu name
        if (!menuEl.dataset.dropdownMenuName) {
            menuEl.dataset.dropdownMenuName = 'dropdown-menu-'+(menuNameCounter++)
            triggerEl.dataset.dropdownMenuTrigger = menuEl.dataset.dropdownMenuName;
        }
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
    // Any menus listener
    if (onCloseListeners['__any__']) {
        onCloseListeners['__any__'].trigger([
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

function getOpenTrigger(menuEl) {
    if (isDropdownMenuOpen(menuEl)) {
        return menuOpenTriggers[menuEl.dataset.dropdownMenuName];
    }
}

let menuMouseEvents = {
    mouseover() {},
    mouseout() {}
}
let menuMouseEventHandlers = {}
function setMouseEvents(menuEl) {
    menuMouseEventHandlers[menuEl.dataset.dropdownMenuName] = {
        mouseover: on(menuEl, 'mouseenter', (ev, menuEl) => {
            menuMouseEvents.mouseover(menuEl);
        }),
        mouseout: on(menuEl, 'mouseleave', (ev, menuEl) => {
            menuMouseEvents.mouseout(menuEl);
        })
    }
}
function unsetMouseEvents(menuEl) {
    off(menuEl, 'mouseenter', menuMouseEventHandlers[menuEl.dataset.dropdownMenuName].mouseover)
    off(menuEl, 'mouseleave', menuMouseEventHandlers[menuEl.dataset.dropdownMenuName].mouseout)
}

function open(triggerEl, menuEl) {

    // Notīrām hide timeout
    clearTimeout(dropDownMenuHideTimeout);

    SingletonPanel.open(menuEl, {
        onOpen(menuEl, panelIndex) {
            menuEl.dataset.dropdownMenuPanelIndex = panelIndex;
            // Uzliekam tabIndex
            menuEl.tabIndex = 0;
            menuEl.hidden = false;

            // Set mouseenter, mouseleave events
            setMouseEvents(menuEl);

            /**
             * Pazīmi, ka menu atvērts liekam uz triggerEl, jo
             * dažādi trigger el var atvērt vienu un to pašu menu
             */
            triggerEl.dataset.dropdownMenuOpen = '1';


            // Pārbaudām vai šim menu jau nav piesaistīts triggerEl
            if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                // Iepriekšējam triggerEl novācam pazīmi, ka uz tā ir atvērts menu
                delete menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuOpen
            }

            // Menu name sasaiste ar open trigger
            menuOpenTriggers[menuEl.dataset.dropdownMenuName] = triggerEl;

            /**
             * Menu iefokusēšana
             */
            if ('dropdownMenuFocus' in triggerEl.dataset) {
                // šo izmantos, lai ignorētu triggerEl focusout
                triggerEl.dataset.dropdownIgnoreFocusout = '';

                /**
                 * TODO šito vajag pāŗtaisit, lai fokuss notiek ātrāk
                 * bez setTimeout, jo uz telefoniem šitā neies cauri, nevarēs iefokusēt
                 *
                 * Ja fokusē pirms ir nopzicionēts, tad scrollTop mainās
                 *
                 * varbūt vajag initial focus, kad noliek apmēram vietā
                 * tad notiek focuss
                 * tad notiek menu parādīšana, lai var nolasīt dimensions
                 * tad notiek precīza pozicionēšana
                 * tad overlay-panel tiek noņemts hidden
                 */
                setTimeout(() => {
                    focusMenu(menuEl, triggerEl.dataset.dropdownMenuFocus);
                }, 10)
            }

            triggerMenuOpenListeners(menuEl, triggerEl);
        },
        onContentElRemove(menuEl) {
            // novācam tab index
            menuEl.tabIndex = -1
            menuEl.hidden = true;

            unsetMouseEvents(menuEl);

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
        },
        triggerEl: triggerEl,
        side: menuEl.dataset.side,
        align: menuEl.dataset.align,
    });

    // Reset form
    if ('dropdownMenuResetForm' in triggerEl.dataset) {
        clearFormData(menuEl);
    }
}

function setOverrideFromOpenTriggerEl(openTriggerEl, menuEl) {

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

/**
 * Menu open trigger apstrādē (click vai hover)
 */
function handleMenuOpenTrigger(triggerEl, {toggle}={}) {
    if (typeof toggle == 'undefined') {
        toggle = true;
    }

    let menuEl = findDropdown(triggerEl);
    if (!menuEl) {
        return
    }

    /**
     * Menu focusout close timeout
     * Skatīties šeit izskaidrojumu on('focusout', '[data-dropdown-menu-name]'
     */
    clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);

    if (toggle) {
        if ('dropdownMenuOpen' in triggerEl.dataset) {
            SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
        }
        else {
            setOverrideFromOpenTriggerEl(triggerEl, menuEl);
            open(triggerEl, menuEl);
        }
    }
    else {
        // Tikai ja nav jau atvērts
        if (!('dropdownMenuOpen' in triggerEl.dataset)) {
            setOverrideFromOpenTriggerEl(triggerEl, menuEl);
            open(triggerEl, menuEl);
        }
    }
}

function closeAllInactive() {
    let panelsStack = SingletonPanel.getStack();

    let lastInactivePanelIndex;
    for (let i = panelsStack.length - 1; i >= 0; i--) {
        if ('dropdownMenuIsActive' in panelsStack[i].contentEl.dataset) {
            // Tikko atrasta pirmā aktīvā menu
            break;
        }
        else {
            // pēdējais nekatīvais panelIndex, tas tiks aizvērts un līdz ar to visi tā childs
            lastInactivePanelIndex = panelsStack[i].panelIndex;
        }
    }

    if (typeof lastInactivePanelIndex != 'undefined') {
        SingletonPanel.close(lastInactivePanelIndex);
    }
}

/**
 * Vai menu ir jāaizver uz mouseout
 */
function isMenuHideOnMouseOut(menuEl) {
    if (!menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
        return false;
    }

    if (menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuHide != 'onmouseout') {
        return false;
    }

    return true;
}

export default {
    init() {
        /**
         * Open
         */
        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            if ('dropdownMenuWasKeydownEnter' in triggerEl.dataset) {
                delete triggerEl.dataset.dropdownMenuWasKeydownEnter;
                return
            }

            switch (triggerEl.dataset.dropdownMenuShow) {
                case 'onclick':
                case 'onfocusin':
                    handleMenuOpenTrigger(triggerEl)
                    break;
            }
        })

        /**
         * Menu hide pogas
         * _container - aizvērs to menu kurā poga ielikta
         * {menu_name} - aizvērs named menu
         */
        click('[data-dropdown-menu-hide]', (ev, buttonEl) => {
            let menuEl;

            if (buttonEl.dataset.dropdownMenuHide == '_container') {
                menuEl = findDropdownMenuByChild(buttonEl);
                if (menuEl) {

                    // Atrkārtoti iefokusējam triggerEl
                    if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                        menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                    }

                    SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)
                }
            }
        })

        // Focusout uz trigger el
        on('focusout', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            // Ignorējam focusout
            if ('dropdownIgnoreFocusout' in triggerEl.dataset) {
                delete triggerEl.dataset.dropdownIgnoreFocusout;
                return;
            }

            if (!('dropdownMenuOpen' in triggerEl.dataset)) {
                return;
            }

            let menuEl = findDropdown(triggerEl);
            if (menuEl) {
                clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
                focusoutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                    delete menuEl.dataset.dropdownMenuIsActive;

                    SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)

                })(menuEl), 5)
            }
        })
        on('focusin', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            // Tikai, ja uzlikts menuShow="onfocusin"
            if (triggerEl.dataset.dropdownMenuShow == 'onfocusin') {
                console.log('focusin uz trigger, atver menu uz focusin');
                //handleMenuOpenTrigger(triggerEl)
            }
        })

        on('keydown', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            switch (ev.key) {
                case 'Enter':
                    // Lai nav form submit
                    ev.preventDefault();
                    triggerEl.dataset.dropdownMenuWasKeydownEnter = '';
                    handleMenuOpenTrigger(triggerEl)
                    break;
                case 'Tab':
                    if ('dropdownMenuOpen' in triggerEl.dataset) {
                        ev.preventDefault();
                        triggerEl.dataset.dropdownIgnoreFocusout = '';
                        focusMenu(findDropdown(triggerEl), triggerEl.dataset.dropdownMenuFocus)
                    }
                    break;
            }
        })


        /**
         * Lai apietu focusout, kad tas notiek uz menuEl open trigger click
         * Click notiek vēlāk nekā focusout. Uz focusout menu jau būs aizvērts, bet uz click atkal atvērts
         * notiek flicker
         * mousedown piefiskē, kurš triggerEl, tas bija un uzliek pazīmi. Vispārējs mouseup notīra pazīmi
         */
        let mousedownTriggerEl;
        on('mousedown', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]', (ev, triggerEl) => {
            // Liekam pazīmi, ka notiek click uz open trigger un tagad is mousedown fāze
            triggerEl.dataset.dropdownMenuIsMousedown = '';
            mousedownTriggerEl = triggerEl;
        });
        // Vispārējs mouseup. Reaģēja tikai, ja bija mousedown uz triggerEl
        on('mouseup', () => {
            if (mousedownTriggerEl) {
                // Notīrām menu hide timeout
                clearTimeout(focusoutTimeout[findDropdown(mousedownTriggerEl).dataset.dropdownMenuName]);

                // Notīrām pazīmi, ka bija mousedown
                delete mousedownTriggerEl.dataset.dropdownMenuIsMousedown;
                mousedownTriggerEl = undefined
            }
        });




        /**
         * Close on outside click
         * šis ir timeout, šo novāks focusout eventi
         * Sis ir tikai, ka lai aizvērtu tās menu, kuras nav aktīvas
         */
        let outsideMousedownTimeout;
        // Click outside menu. Close all panels stack
        on('mousedown', 'html', (ev) => {

            // Ja nav atvērtu panels, tad neko nedarām
            if (SingletonPanel.getStack().length == 0) {
                return;
            }

            // Click ir menu elementā, skip
            if (parent(ev.target, '[data-dropdown-menu-name]')) {
                return;
            }

            // Click ir open trigger elementā
            if (parent(ev.target, '[data-dropdown-menu-trigger]')) {
                return;
            }

            outsideMousedownTimeout = setTimeout(() => {
                // aizveram visas atvērtās menu
                SingletonPanel.closeAll();
            }, 5)
        });


        // Esc uz Menu
        on('keydown', '[data-dropdown-menu-name]', (ev, menuEl) => {
            switch (ev.key) {
                case 'Escape':
                    // Ja event notika uz open trigger, tad skip
                    if (parent(ev.target, '[data-dropdown-menu-trigger]')) {
                        break;
                    }

                    // Atrkārtoti iefokusējam triggerEl
                    if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                        menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                    }

                    SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)

                    break;
            }
        })

        // Esc uz menu Trigger
        on('keydown', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {
            let menuEl;
            switch (ev.key) {
                case 'Escape':
                    // Ja menu ir atvērts, tad aizveram menu
                    if ('dropdownMenuOpen' in triggerEl.dataset) {
                        menuEl = findDropdown(triggerEl);

                        SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)
                    }
                    else {
                        // Aizveram to menu, kurā ir Trigger
                        menuEl = findDropdownMenuByChild(triggerEl);
                        if (menuEl) {

                            // Atrkārtoti iefokusējam triggerEl
                            if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                                menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                            }

                            SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)
                        }
                    }
                    break;
            }
        })

        // Focusout uz menu
        on('focusout', '[data-dropdown-menu-name]', (ev, menuEl) => {
            if ('dropdownMenuFocusTrap' in ev.target.dataset) {
                return;
            }

            clearTimeout(outsideMousedownTimeout);

            // Ms pēc kurām aizvēr menu, ja vien kāds nepārtrauks šo timeout
            let closeDealyMs = 5;

            let triggerEl = getOpenTrigger(menuEl);
            if (triggerEl && ('dropdownMenuIsMousedown' in triggerEl.dataset)) {
                /**
                 * Ja notiek click uz menuEl triggerEl, tad uzreiz neveram ciet, bet dodam ilgu, laiku
                 * lai notiek click. Varbūt 5s ir par daudz, nav ne jausmas
                 * doma tāda, ka šo timeout pārtrauks click uz triggerEl
                 */
                closeDealyMs = 5000;
            }

            clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
            focusoutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                delete menuEl.dataset.dropdownMenuIsActive;

                closeAllInactive()

            })(menuEl), closeDealyMs)
        })
        on('focusin', '[data-dropdown-menu-name]', (ev, menuEl) => {
            if ('dropdownMenuFocusTrap' in ev.target.dataset) {
                return;
            }

            clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);

            menuEl.dataset.dropdownMenuIsActive = '';
        })


        /**
         * Fokuss trap dos zināt, ka ir sasniegts pēdējais elements menu
         * 1. aizveram menu un iefokusējam triggerEl
         * 2. iefokusējam pirmo el un taisam cycle pa visiem laukiem
         */
        let focusCycle = true;
        on('focusin', '[data-dropdown-menu-name] [data-dropdown-menu-focus-trap]', (ev, focusTrapEl) => {
            let menuEl = findDropdownMenuByChild(focusTrapEl);
            clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);

            if (focusCycle) {
                // Cycle
                findFirstFocusable(menuEl).focus()
            }
            else {
                // Atrkārtoti iefokusējam triggerEl
                if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                    menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                }

                SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)
            }
        })



        onMouseOverOut('[data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]', {
            mouseover(ev, triggerEl) {

                let menuEl = findDropdown(triggerEl);
                if (menuEl) {
                    clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                }

                handleMenuOpenTrigger(triggerEl, {
                    toggle: false
                });
            }
        })

        onMouseOverOut('[data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]', {
            mouseover(ev, triggerEl) {
                if ('dropdownMenuOpen' in triggerEl.dataset) {
                    return;
                }

                let menuEl = findDropdown(triggerEl);
                if (menuEl) {
                    clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                }
            },
            mouseout(ev, triggerEl) {
                let menuEl = findDropdown(triggerEl);
                if (menuEl) {
                    clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                    menuMouseOutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                        delete menuEl.dataset.dropdownMenuIsActive;

                        SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)

                    })(menuEl), 500)
                }
            }
        })


        // Mouse over un out eventi tikai uz tām menu, kurā menuHide="onmouseout"
        let menuMouseOutTimeout = {};
        menuMouseEvents = {
            mouseout(menuEl) {
                if (!isMenuHideOnMouseOut(menuEl)) {
                    return;
                }

                clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                menuMouseOutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                    delete menuEl.dataset.dropdownMenuIsActive;

                    closeAllInactive()

                })(menuEl), 500)
            },
            mouseover(menuEl) {
                clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                menuEl.dataset.dropdownMenuIsActive = '';
            }
        }





        // Menu item click
        on('click', '[data-dropdown-menu-name] .menu-item', (ev, menuItemEl) => {
            let menuEl = findDropdownMenuByChild(menuItemEl)
            if (menuEl) {
                SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
            }
        });

        // Set mouse events on not hidden menus
        qa('[data-dropdown-menu-name]:not([hidden])').forEach(menuEl => {
            setMouseEvents(menuEl);
        })

    },

    /**
     * Aizveram DropdownMenu
     */
    close(menuEl) {
        if (menuEl) {
            if (isDropdownMenuOpen(menuEl)) {

                // Atrkārtoti iefokusējam triggerEl
                if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                    menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                }

                SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex);
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
        return getOpenTrigger(menuEl)
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
    },

    onCloseAny(cb) {
        if (typeof onCloseListeners['__any__'] == 'undefined') {
            onCloseListeners['__any__'] = new Listeners();
        }
        onCloseListeners['__any__'].listen(cb);
    }
}