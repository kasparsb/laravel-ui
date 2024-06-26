import {
    jsx, q, qa, parent,
    addStyle, addClass, removeClass,
    append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions, getWindowScrollLeft,
    isChild, click, on} from 'dom-helpers';
import ButtonDelete from './ButtonDelete';

let container;
let activeClickTriggerEl;
let isOpen = false;
let dropDownMenuHideTimeout = 0;

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

function findDropdownMenu(name) {
    return q('[data-dropdown-menu-name="'+name+'"]');
}

function close() {

    // Uzliekam hidden klasi uz dropdown menu
    addClass(q(container, '[data-dropdown-menu-name]'), 'hidden');

    container.dataset.visible = '';

    isOpen = false;

    activeClickTriggerEl = undefined;
}

function open(clickTriggerEl, menuEl) {

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

function setOverrideFromClickTriggerEl(clickTriggerEl, menuEl) {
    qa(menuEl, '[data-role="menuitem"]').forEach(menuItemEl => {

        if (menuItemEl.dataset.linkSource) {
            menuItemEl.setAttribute('href', clickTriggerEl.getAttribute(menuItemEl.dataset.linkSource))
            if (ButtonDelete.isButtonDelete(menuItemEl)) {
                menuItemEl.setAttribute('data-url', clickTriggerEl.getAttribute(menuItemEl.dataset.linkSource))
            }
        }

        if (menuItemEl.dataset.redirectSource) {
            menuItemEl.setAttribute('data-redirect', clickTriggerEl.getAttribute(menuItemEl.dataset.redirectSource))
        }

    })
}

export default {
    init() {
        click('html', (ev, el) => {
            if (isOpen) {
                let clickTriggerEl = parent(ev.target, '[data-dropdown-menu]');

                // Ja nospiests jau uz nospiestā click trigger
                if (clickTriggerEl && (activeClickTriggerEl === clickTriggerEl)) {

                }
                // Ja el nav container, tad aizveram container
                else if (isChild(ev.target, container)) {

                }
                else {
                    close();
                }
            }
        })

        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu][data-dropdown-menu-show="onclick"]', (ev, clickTriggerEl) => {
            if (clickTriggerEl.dataset.dropdownMenu) {
                let menuEl = findDropdownMenu(clickTriggerEl.dataset.dropdownMenu);
                if (menuEl) {
                    if (isOpen) {
                        close();
                    }
                    else {
                        setOverrideFromClickTriggerEl(clickTriggerEl, menuEl);

                        open(clickTriggerEl, menuEl);
                    }
                }
            }
        })


        on('mouseover', '[data-dropdown-menu][data-dropdown-menu-show="onhover"]', (ev, hoverTriggerEl) => {
            if (hoverTriggerEl.dataset.dropdownMenu) {
                let menuEl = findDropdownMenu(hoverTriggerEl.dataset.dropdownMenu);
                if (menuEl) {
                    setOverrideFromClickTriggerEl(hoverTriggerEl, menuEl);

                    open(hoverTriggerEl, menuEl);
                }
            }
        })
        on('mouseout', '[data-dropdown-menu][data-dropdown-menu-show="onhover"]', (ev, hoverTriggerEl) => {
            if (hoverTriggerEl.dataset.dropdownMenu) {
                if (isOpen) {
                    // uzliek hide timeout, kur notīra, ja vajag parādīt citu menu
                    dropDownMenuHideTimeout = setTimeout(() => close(), 50000)
                }
            }
        });

        // mouse over uz dropdown menu
        on('mouseover', '[data-dropdown-menu-name]', (ev, menuEl) => {
            clearTimeout(dropDownMenuHideTimeout);
        });
        // always hide menu whene mouse out from menu
        on('mouseout', '[data-dropdown-menu-name]', (ev, menuEl) => {
            dropDownMenuHideTimeout = setTimeout(() => close(), 500)
        });
        // on menu item click
        on('click', '.menu-item', (ev, menuEl) => {
            dropDownMenuHideTimeout = setTimeout(() => close(), 100)
        });
    },

    /**
     * Aizveram redzamo DropdownMenu
     */
    close() {
        if (isOpen) {
            close();
        }
    },

    /**
     * Tagad vienkārši atgriež pēdējo aktīvo click trigger
     * TODO jāsaprot vai tik brīvi var darīt? Pēc idejas, ja ir DropdownMenu redzams, tad pēdējas click trigger
     * arī būs īstais. Nevar tā būt, ka notiek click un neredzama menuitem
     */
    findClickTrigger() {
        return activeClickTriggerEl;
    }
}