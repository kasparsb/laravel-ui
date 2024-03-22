import {
    jsx, q, parent,
    addStyle, addClass, removeClass,
    append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions, getWindowScrollLeft,
    isChild, click} from 'dom-helpers';

let container;
let isOpen = false;

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
}

function open(clickTriggerEl, menuEl) {

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

export default {
    init() {
        click('html', (ev, el) => {
            if (isOpen) {
                // Ja el nav date pickerī, tad aizveram kalendāru
                if (!isChild(ev.target, container)) {
                    close();
                }
            }

        })

        // Click triggeri, kuri atvērs menu
        click('[data-dropdown-menu]', (ev, clickTriggerEl) => {
            if (clickTriggerEl.dataset.dropdownMenu) {
                let menuEl = findDropdownMenu(clickTriggerEl.dataset.dropdownMenu);
                if (menuEl) {
                    open(clickTriggerEl, menuEl);
                }
            }
        })
    }
}