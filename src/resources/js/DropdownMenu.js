import {q, qa, parent, addClass, removeClass, isChild, append, click, on, clearFormData} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';
import SingletonPanel from './SingletonPanel';
import Listeners from './helpers/Listeners';

let activeClickTriggerEl;
let isOpen = false;
let dropDownMenuHideTimeout = 0;
// default event, kad slēpt menu
let menuHideOn;

let onOpenListeners = {};

function findDropdownMenuByName(name) {
    return q('[data-dropdown-menu-name="'+name+'"]');
}

function findDropdownMenuByChild(childEl) {
    return parent(childEl, '[data-dropdown-menu-name]');
}

/**
 * Vai padotais dropdown menu ir atvērts
 */
function isDropdownMenuOpen(dropdownMenuEl) {
    return dropdownMenuEl === SingletonPanel.getContentEl();
}

function close() {

    SingletonPanel.close();

    isOpen = false;

    activeClickTriggerEl = undefined;
}

function open(clickTriggerEl, menuEl) {

    // Vai vajag reset form
    if ('dropdownMenuResetForm' in clickTriggerEl.dataset) {
        clearFormData(menuEl);
    }

    // Notīrām hide timeout
    clearTimeout(dropDownMenuHideTimeout);

    activeClickTriggerEl = clickTriggerEl;

    SingletonPanel.show(menuEl, {
        onContentElRemove(prevMenuEl) {
            // uzliekam hidden klasi
            addClass(prevMenuEl, 'hidden');
            // append back to body, jo var būt vairāki menu un tos meklēs body
            append(q('body'), prevMenuEl);
        },
        triggerEl: clickTriggerEl,
        side: menuEl.dataset.side,
        align: menuEl.dataset.align,
    });

    isOpen = true;

    // Novācam hidden klasi no dropdown menu
    removeClass(menuEl, 'hidden');

    if (menuEl.dataset.dropdownMenuName) {
        if (onOpenListeners[menuEl.dataset.dropdownMenuName]) {
            onOpenListeners[menuEl.dataset.dropdownMenuName].trigger([
                menuEl,
                activeClickTriggerEl
            ])
        }
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

export default {
    init() {
        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]', (ev, clickTriggerEl) => {
            if (clickTriggerEl.dataset.dropdownMenuTrigger) {
                let menuEl = findDropdownMenuByName(clickTriggerEl.dataset.dropdownMenuTrigger);
                if (menuEl) {
                    if (isOpen) {
                        close();
                    }
                    else {
                        setOverrideFromOpenTriggerEl(clickTriggerEl, menuEl);

                        open(clickTriggerEl, menuEl);
                    }
                }
            }
        })

        /**
         * Menu hide trigger
         * Šis ir domāts, lai varētu aizvērt menu uz click
         * piemēram, poga pašā menu, kuru nospiežot menu aizveras
         * varētu būt arī poga ārpus menu
         *
         * ! data-dropdown-menu-hide tiek arī izmantots, lai noteiktu
         * kā aizvērt dropdown menu no open trigger
         * tāpēc šeit click skatamies tikai uz tiek elementiem,
         * kuriem nav norādīts, ka ir open trigger
         */
        click('[data-dropdown-menu-hide]', (ev, clickTriggerEl) => {
            // Ja ir dropdownMenuTrigger, tad ignorējam click
            if (clickTriggerEl.dataset.dropdownMenuTrigger) {

            }
            else {
                // Atrodam menu kuru aizvērt
                let dropdownMenuToClose;
                switch (clickTriggerEl.dataset.dropdownMenuHide) {
                    case '_container':
                        dropdownMenuToClose = findDropdownMenuByChild(clickTriggerEl);
                        break;
                    default:
                        dropdownMenuToClose = findDropdownMenuByName(clickTriggerEl.dataset.dropdownMenuHide);
                }

                // Ja menu ir atvērtais menu, tad close
                if (isDropdownMenuOpen(dropdownMenuToClose)) {
                    close();
                }
            }
        });


        on('mouseover', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]', (ev, hoverTriggerEl) => {
            if (hoverTriggerEl.dataset.dropdownMenuTrigger) {
                let menuEl = findDropdownMenuByName(hoverTriggerEl.dataset.dropdownMenuTrigger);
                if (menuEl) {
                    setOverrideFromOpenTriggerEl(hoverTriggerEl, menuEl);

                    open(hoverTriggerEl, menuEl);
                }
            }
        })

        // mousout no click trigger, kuram ir onhover
        on('mouseout', '[data-dropdown-menu-trigger]', (ev, hoverTriggerEl) => {
            if (hoverTriggerEl.dataset.dropdownMenuTrigger) {
                if (isOpen) {
                    if (menuHideOn == 'onmouseout') {
                        // uzliek hide timeout, kur notīra, ja vajag parādīt citu menu
                        dropDownMenuHideTimeout = setTimeout(() => close(), 200)
                    }
                }
            }
        });


        // mouse over uz dropdown menu
        on('mouseover', '[data-dropdown-menu-name]', (ev, menuEl) => {
            clearTimeout(dropDownMenuHideTimeout);
        });

        // mouse out from menu
        on('mouseout', '[data-dropdown-menu-name]', (ev, menuEl) => {
            if (menuHideOn == 'onmouseout') {
                dropDownMenuHideTimeout = setTimeout(() => close(), 500)
            }
        });

        // on menu item click
        on('click', '[data-dropdown-menu-name] .menu-item', (ev, menuEl) => {
            dropDownMenuHideTimeout = setTimeout(() => close(), 100)
        });

        // Click outside dropdown menu
        click('html', ev => {
            if (isOpen) {
                let clickTriggerEl = parent(ev.target, '[data-dropdown-menu-trigger]');

                // Ja nospiests jau uz nospiestā click trigger
                if (clickTriggerEl && (activeClickTriggerEl === clickTriggerEl)) {

                }
                // Ja nospiests uz elementu, kurš ir atvērtajā dropdown menu
                else if (isChild(ev.target, SingletonPanel.getEl())) {

                }
                else {
                    close();
                }
            }
        })

        on('keyup', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            if (!isOpen) {
                return
            }
            console.log(ev.key);
            switch (ev.key) {
                case 'Escape':
                    close();
                    break;
            }
        });


        on('focusin', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            triggerEl.dataset.wasFocusIn = '';

            if (triggerEl.dataset.dropdownMenuTrigger) {
                let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
                if (menuEl) {
                    if (isOpen) {
                        close();
                    }
                    else {
                        setOverrideFromOpenTriggerEl(triggerEl, menuEl);

                        open(triggerEl, menuEl);
                    }
                }
            }
        })
        // Ja ir iefokusēts, tad atkārtoti nevarēs atvērt, tāpēc ir vēl click
        click('[data-dropdown-menu-trigger][data-dropdown-menu-show="onfocusin"]', (ev, triggerEl) => {
            if (('wasFocusIn' in triggerEl.dataset)) {
                delete triggerEl.dataset.wasFocusIn;
            }
            else {
                if (triggerEl.dataset.dropdownMenuTrigger) {
                    let menuEl = findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
                    if (menuEl) {
                        if (isOpen) {
                            close();
                        }
                        else {
                            setOverrideFromOpenTriggerEl(triggerEl, menuEl);

                            open(triggerEl, menuEl);
                        }
                    }
                }
            }
        })
    },

    /**
     * Aizveram redzamo DropdownMenu
     */
    close(dropdownMenuToClose) {
        if (dropdownMenuToClose) {
            if (isDropdownMenuOpen(dropdownMenuToClose)) {
                close();
            }
        }
        else {
            if (isOpen) {
                close();
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

    getOpenTrigger(dropdownMenuEl) {
        if (isDropdownMenuOpen(dropdownMenuEl)) {
            return activeClickTriggerEl;
        }
    },

    getOpenTriggerByChild(childEl) {
        let dropdownMenuEl = findDropdownMenuByChild(childEl);
        if (dropdownMenuEl && isDropdownMenuOpen(dropdownMenuEl)) {
            return activeClickTriggerEl;
        }
    },

    onOpen(menuName, cb) {
        if (typeof onOpenListeners[menuName] == 'undefined') {
            onOpenListeners[menuName] = new Listeners();
        }
        onOpenListeners[menuName].listen(cb);
    }
}