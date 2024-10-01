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

function findRelativeEl(el, querySelector) {
    let p = querySelector.indexOf(':');

    // Kurā virzienā meklēt pēc querySelector (parent|child)
    let searchDirection = querySelector.substring(0, p);
    let query = querySelector.substring(p+1);

    if (searchDirection == 'parent') {
        return parent(el, query)
    }

    // child
    return q(el, query)
}

function findFirstFocusable(el) {
    let candidates  = qa(el, 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    for (let i = 0; i < candidates.length; i++) {
        // Jāpārbauda vai tabindex ir -1
        if (candidates[i].tabIndex < 0) {
            continue;
        }

        // Skip focus trap
        if ('dropdownMenuFocusTrap' in candidates[i].dataset) {
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
        // Fokusējam contentEl
        focusableEl = q(menuEl, '[data-dropdown-menu-content-el]');
    }

    focusableEl.focus();

    return focusableEl;
}

function findDropdownMenuEl(triggerEl) {
    // nākošais sibling no triggerEl
    if (triggerEl.dataset.dropdownMenuTrigger == 'dom.nextSibling') {
        return next(triggerEl, '[data-dropdown-menu-name]');
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
    // Any menus listener
    if (onOpenListeners['__any__']) {
        onOpenListeners['__any__'].trigger([
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

    let positionX = menuEl.dataset.positionX;
    let positionY = menuEl.dataset.positionY;
    let positionDir = menuEl.dataset.positionDir;
    let positionXOffset = menuEl.dataset.positionXOffset;
    let positionYOffset = menuEl.dataset.positionYOffset;

    // Skatamies vai triggerEl override
    if ('dropdownMenuPositionX' in triggerEl.dataset) {
        positionX = triggerEl.dataset.dropdownMenuPositionX
    }
    if ('dropdownMenuPositionY' in triggerEl.dataset) {
        positionY = triggerEl.dataset.dropdownMenuPositionY
    }
    if ('dropdownMenuPositionDir' in triggerEl.dataset) {
        positionDir = triggerEl.dataset.dropdownMenuPositionDir
    }
    if ('dropdownMenuPositionXOffset' in triggerEl.dataset) {
        positionXOffset = triggerEl.dataset.dropdownMenuPositionXOffset
    }
    if ('dropdownMenuPositionYOffset' in triggerEl.dataset) {
        positionYOffset = triggerEl.dataset.dropdownMenuPositionYOffset
    }

    // Pēc noklusējuma nav pozicionēšanas elementa
    let positionEl = null;
    let positionElDir = menuEl.dataset.positionAtDir;

    if (menuEl.dataset.positionAt) {
        /**
         * TODO laikam menuEl.dataset.positionAt jāuzskata kā querySelector
         *
         * Special keyword ir viewport
         */
        if (menuEl.dataset.positionAt == 'viewport') {
            positionEl = menuEl.dataset.positionAt;
        }
        else {
            positionEl = q(menuEl.dataset.positionAt);
        }
    }

    // Skatamies vai triggerEl override
    if ('dropdownMenuPositionAt' in triggerEl.dataset) {
        if (triggerEl.dataset.dropdownMenuPositionAt == 'viewport') {
            positionEl = triggerEl.dataset.dropdownMenuPositionAt;
        }
        else {
            if (triggerEl.dataset.dropdownMenuPositionAt) {
                positionEl = findRelativeEl(triggerEl, triggerEl.dataset.dropdownMenuPositionAt)
            }
            else {
                // ja nav norādīts konkrēts selector, tad pats triggerEl
                positionEl = triggerEl
            }
        }
    }
    if ('dropdownMenuPositionAtDir' in triggerEl.dataset) {
        positionElDir = triggerEl.dataset.dropdownMenuPositionAtDir
    }

    SingletonPanel.open(menuEl, {
        /**
         * Kādā scenārijā vērt ciet menu
         * Ja nav nodefinēts, tad menu netiek vērts ciet
         **/
        hide: 'dropdownMenuHide' in triggerEl.dataset ? triggerEl.dataset.dropdownMenuHide : false,
        positionEl: positionEl,
        positionElDir: positionElDir,
        x: positionX,
        y: positionY,
        xOffset: positionXOffset,
        yOffset: positionYOffset,
        dir: positionDir,
        onOpen(menuEl, panelIndex) {
            // Dropdown menu hide vērtību replicējam pie menuEl
            // tikai, ja tā ir uzlikta. Ja nav uzlikta, tad drošības pēc dzēšam no menuEl
            if ('dropdownMenuHide' in triggerEl.dataset) {
                menuEl.dataset.dropdownMenuHide = triggerEl.dataset.dropdownMenuHide;
            }
            else {
                delete menuEl.dataset.dropdownMenuHide;
            }

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

            /**
             * Tas elements, kuru padots uz Dropdown menu kā to
             * elementu, kurā var ielikt vērtību. Ja dropdown panel
             * ir tāda vajadzība
             */
            let targetEl = triggerEl;
            if (triggerEl.dataset.dropdownMenuTargetEl) {
                targetEl = findRelativeEl(triggerEl, triggerEl.dataset.dropdownMenuTargetEl)
            }
            triggerMenuOpenListeners(menuEl, targetEl);
        },
        onContentElRemove(menuEl) {
            delete menuEl.dataset.dropdownMenuHide;

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

            /**
             * Tas elements, kuru padots uz Dropdown menu kā to
             * elementu, kurā var ielikt vērtību. Ja dropdown panel
             * ir tāda vajadzība
             */
            let targetEl = menuOpenTriggerEl;
            if (menuOpenTriggerEl.dataset.dropdownMenuTargetEl) {
                targetEl = findRelativeEl(menuOpenTriggerEl, menuOpenTriggerEl.dataset.dropdownMenuTargetEl)
            }
            triggerMenuCloseListeners(menuEl, targetEl);
        }
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

        // pēdējais nekatīvais panelIndex, tas tiks aizvērts un līdz ar to visi tā childs
        lastInactivePanelIndex = panelsStack[i].panelIndex;
    }

    if (typeof lastInactivePanelIndex != 'undefined') {

        if (!panelsStack[lastInactivePanelIndex].hide) {
            return;
        }


        SingletonPanel.close(lastInactivePanelIndex);
    }
}

export default {
    init() {





        /**
         * Open
         */
        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu-trigger]', (ev, triggerEl) => {

            //console.log('-    OP click [data-dropdown-menu-trigger]', triggerEl.dataset.dropdownMenuShow);

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

            //console.log('-    CL click [data-dropdown-menu-hide] tikai, ja _container');

            if (buttonEl.dataset.dropdownMenuHide != '_container') {
                return;
            }

            let menuEl = findDropdownMenuByChild(buttonEl);
            if (menuEl) {

                // Atrkārtoti iefokusējam triggerEl
                if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                    menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
                }

                SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)
            }
        })

        // Focusout uz trigger el
        // ---- CLOSE menu
        on('focusout', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {

            //console.log('-    CL focusout [data-dropdown-menu-trigger]');

            // Ignorējam focusout
            if ('dropdownIgnoreFocusout' in triggerEl.dataset) {
                delete triggerEl.dataset.dropdownIgnoreFocusout;
                return;
            }

            // Ja nav atvērt menu, tad skip
            if (!('dropdownMenuOpen' in triggerEl.dataset)) {
                return;
            }

            let menuEl = findDropdown(triggerEl);
            if (!('dropdownMenuHide' in menuEl.dataset)) {
                return;
            }

            if (menuEl) {
                clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
                focusoutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                    delete menuEl.dataset.dropdownMenuIsActive;

                    SingletonPanel.close(menuEl.dataset.dropdownMenuPanelIndex)

                })(menuEl), 5)
            }
        })
        on('focusin', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {

            //console.log('-    NA focusin [data-dropdown-menu-trigger]');

            // Tikai, ja uzlikts menuShow="onfocusin"
            if (triggerEl.dataset.dropdownMenuShow == 'onfocusin') {
                /**
                 *
                 * TODO salabot, lai ir arī focusin
                 *
                 */
                //console.log('focusin uz trigger, atver menu uz focusin');
                //handleMenuOpenTrigger(triggerEl)
            }
        })

        on('keydown', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {

            //console.log('-    keydown [data-dropdown-menu-trigger]');

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

        // Esc uz Menu
        on('keydown', '[data-dropdown-menu-name]', (ev, menuEl) => {

            //console.log('-    CL keydown [data-dropdown-menu-name]');

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

        /**
         * Esc uz menu Trigger
         *
         * Esc nevar noķert uz input el. tur vajag izmantot focusout
         */
        // ---- CLOSE menu
        on('keydown', '[data-dropdown-menu-trigger]', (ev, triggerEl) => {

            //console.log('-    CL keydown [data-dropdown-menu-trigger]', ev.key, triggerEl);

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
        // ---- CLOSE menu
        on('focusout', '[data-dropdown-menu-name]', (ev, menuEl) => {

            //console.log('-    CL focusout [data-dropdown-menu-name]');

            // Ignorējam focusout
            if ('dropdownIgnoreFocusoutOnce' in menuEl.dataset) {
                delete menuEl.dataset.dropdownIgnoreFocusoutOnce;
                return;
            }

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

            //console.log('-    focusin [data-dropdown-menu-name]');

            if ('dropdownMenuFocusTrap' in ev.target.dataset) {
                return;
            }

            clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);

            menuEl.dataset.dropdownMenuIsActive = '';
        })

        /**
         * Lai apietu focusout, kad tas notiek uz menuEl open trigger click
         * Click notiek vēlāk nekā focusout. Uz focusout menu jau būs aizvērts, bet uz click atkal atvērts
         * notiek flicker
         * mousedown piefiskē, kurš triggerEl, tas bija un uzliek pazīmi. Vispārējs mouseup notīra pazīmi
         */
        let mousedownTriggerEl;
        on('mousedown', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]', (ev, triggerEl) => {

            //console.log('-    mousedown [data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]');

            // Liekam pazīmi, ka notiek click uz open trigger un tagad is mousedown fāze
            triggerEl.dataset.dropdownMenuIsMousedown = '';
            mousedownTriggerEl = triggerEl;
        });
        // Vispārējs mouseup. Reaģēja tikai, ja bija mousedown uz triggerEl
        on('mouseup', () => {

            //console.log('-    mouseup html');

            if (mousedownTriggerEl) {
                // Notīrām menu hide timeout
                let menuEl = findDropdown(mousedownTriggerEl);
                if (menuEl) {
                    clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
                }

                // Notīrām pazīmi, ka bija mousedown
                delete mousedownTriggerEl.dataset.dropdownMenuIsMousedown;
                mousedownTriggerEl = undefined
            }
        });


        /**
         * Fokuss trap dos zināt, ka ir sasniegts pēdējais elements menu
         * 1. aizveram menu un iefokusējam triggerEl
         * 2. iefokusējam pirmo el un taisam cycle pa visiem laukiem
         */
        let focusCycle = true;
        on('focusin', '[data-dropdown-menu-name] [data-dropdown-menu-focus-trap]', (ev, focusTrapEl) => {

            //console.log('-    CL focusin [data-dropdown-menu-name] [data-dropdown-menu-focus-trap]');

            let menuEl = findDropdownMenuByChild(focusTrapEl);
            clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);

            if (focusCycle) {
                // Cycle
                let firstFocusable = findFirstFocusable(menuEl);
                if (firstFocusable) {
                    firstFocusable.focus()
                }
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

                //console.log('-    OP mouseover [data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]');

                let menuEl = findDropdown(triggerEl);
                if (menuEl) {
                    clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                }

                handleMenuOpenTrigger(triggerEl, {
                    toggle: false
                });
            }
        })

        // ---- CLOSE menu
        /**
         * Reaģējam tikai, ja uz triggerEl ir atvērts menu
         */
        onMouseOverOut('[data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]', {
            mouseover(ev, triggerEl) {

                //console.log('-    mouseover [data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]');

                if (!('dropdownMenuOpen' in triggerEl.dataset)) {
                    return
                }

                // šitas nav vajadzīgs, jo ja atver uz click, tad moseout un mousover vairs nenostrādā un menu aizveras
                // if ('dropdownMenuOpen' in triggerEl.dataset) {
                //     return;
                // }


                let menuEl = findDropdown(triggerEl);
                if (menuEl) {
                    clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                }
            },
            mouseout(ev, triggerEl) {

                //console.log('-    CL mouseout [data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]');

                /**
                 * Ja dažādiem triggerEl ir viens un tas pats menuEl (by name)
                 * tad uz tā otrā triggerEl mouseout nostrādās menu slēpšana
                 *
                 * tāpēc te vajag pārbaudīt vai vispār šim triggerEl ir atvērts menu
                 */
                if (!('dropdownMenuOpen' in triggerEl.dataset)) {
                    return
                }

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
        // ---- CLOSE menu
        menuMouseEvents = {
            mouseout(menuEl) {

                //console.log('-    CL mouseout PANEL');

                if (menuEl.dataset.dropdownMenuHide != 'onmouseout') {
                    return;
                }

                clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                menuMouseOutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(((menuEl) => () => {

                    delete menuEl.dataset.dropdownMenuIsActive;

                    closeAllInactive()

                })(menuEl), 500)
            },
            mouseover(menuEl) {

                //console.log('-    mouseover PANEL');

                clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
                menuEl.dataset.dropdownMenuIsActive = '';
            }
        }





        // Menu item click
        // ---- CLOSE menu
        on('click', '[data-dropdown-menu-name] .menu-item', (ev, menuItemEl) => {


            let menuEl = findDropdownMenuByChild(menuItemEl)
            if (menuEl) {
                let triggerEl = menuOpenTriggers[menuEl.dataset.dropdownMenuName];

                if (!('dropdownMenuHide' in triggerEl.dataset)) {
                    return;
                }

                // Aizvera visas
                SingletonPanel.closeAll();
            }
        });










        /**
         * Close on outside click
         * šis ir timeout, šo novāks focusout eventi
         * Sis ir tikai, ka lai aizvērtu tās menu, kuras nav aktīvas
         */
        let outsideMousedownTimeout;
        // Click outside menu. Close all panels stack
        // ---- CLOSE menu
        on('mousedown', 'html', (ev) => {

            //console.log('-    CL mousedown html');

            // Ja nav atvērtu panels, tad neko nedarām
            if (SingletonPanel.getStack().length == 0) {
                return;
            }

            // Click ir menu elementā
            if (parent(ev.target, '[data-dropdown-menu-name]')) {

                let menuEl = findDropdownMenuByChild(ev.target);
                /**
                 * Aizveram visus menu virs tā, kurā notika click
                 * te timeout nevajag, jo click notiek menu un te nostrādās arī focusout, gan uzreiz focusin
                 * tas ir menu kurā notiek click neaizvērsies. Aizvērsies visi virs tā
                 * savukārt ja notiek click uz html, tad menuEl saņems focusout
                 */
                //console.log('SingletonPanel.closeAllAboveIndex', menuEl.dataset.dropdownMenuPanelIndex);
                SingletonPanel.closeAllAboveIndex(menuEl.dataset.dropdownMenuPanelIndex);

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

    ignoreFocusoutOnce(menuEl) {
        menuEl.dataset.dropdownIgnoreFocusoutOnce = '';
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

    onOpenAny(cb) {
        if (typeof onOpenListeners['__any__'] == 'undefined') {
            onOpenListeners['__any__'] = new Listeners();
        }
        onOpenListeners['__any__'].listen(cb);
    },

    onCloseAny(cb) {
        if (typeof onCloseListeners['__any__'] == 'undefined') {
            onCloseListeners['__any__'] = new Listeners();
        }
        onCloseListeners['__any__'].listen(cb);
    }
}