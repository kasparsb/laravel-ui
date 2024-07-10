import {
    jsx, q, qa, parent,
    addStyle, addClass, removeClass,
    append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions,
    isChild, click, on,
    clearFormData} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';

let container;
let activeClickTriggerEl;
let isOpen = false;
let dropDownMenuHideTimeout = 0;
// default event, kad slēpt menu
let menuHideOn;

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar(menuEl) {
    if (!container) {
        container = (
            <div class="overlay-container"></div>
        )

        append('body', container);
    }

    // previous menu izņemam ārā un ieliek body, lai nepazūd
    let previousMenuEl = q(container, '[data-dropdown-menu-name]');
    if (previousMenuEl) {
        addClass(previousMenuEl, 'hidden');
        append(q('body'), previousMenuEl);
    }

    replaceContent(container, menuEl);
}

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
    return dropdownMenuEl === q(container, '[data-dropdown-menu-name]');
}

function close() {

    // Uzliekam hidden klasi uz dropdown menu
    addClass(q(container, '[data-dropdown-menu-name]'), 'hidden');

    container.dataset.visible = '';

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

    maybeCreateContainerAndCalendar(menuEl);

    isOpen = true;


    // Novācam hidden klasi no dropdown menu
    removeClass(q(container, '[data-dropdown-menu-name]'), 'hidden');

    let side = menuEl.dataset.side;
    let align = menuEl.dataset.align;

    // Pozicionē container pret input lauku
    let p = getOffset(clickTriggerEl)
    let triggerDimensions = getOuterDimensions(clickTriggerEl);
    let menuDimensions = getOuterDimensions(menuEl);

    let gap = 4;

    let css = {};

    if (side == 'bottom' || side == 'top') {
        if (side == 'bottom') {
            css.top = (p.top + triggerDimensions.height + gap);
        }
        else {
            css.top = (p.top - menuDimensions.height - gap);
        }

        /**
         * ! css.right apzīmē kādas būs menu labās puses koordinātes
         * tas vajadzīgs, lai noteiktu, vai menu būs ārpus window robežām
         */


        if (align == 'left') {
            css.left = p.left;
            css.right = p.left + menuDimensions.width;
        }
        else if (align == 'right') {
            css.left = ((p.left + triggerDimensions.width) - menuDimensions.width);
            css.right = css.left
        }
        else if (align == 'center') {
            css.left = ((p.left + (triggerDimensions.width / 2)) - (menuDimensions.width / 2));
            css.right = css.left + (menuDimensions.width / 2);
        }
    }


    // Ierobežojam left, ja tas ir novieto menu ārpus window robežām
    let windowDimensions = getWindowDimensions();
    // Atņemam scrollbar width
    windowDimensions.width = windowDimensions.width - 20;
    if (css.right > windowDimensions.width) {
        css.left = css.left - (css.right - windowDimensions.width) - gap;
    }
    else if (css.left < gap) {
        css.left = gap;
    }

    addStyle(container, {
        top: css.top + 'px',
        left: css.left + 'px'
    })

    container.dataset.visible = 'yes';
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
        on('click', '.menu-item', (ev, menuEl) => {
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
                else if (isChild(ev.target, container)) {

                }
                else {
                    close();
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
    }
}