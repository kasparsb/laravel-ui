import {jsx, q, parent, addStyle, addClass, removeClass, append, replaceContent, getOffset, isChild, click} from 'dom-helpers';

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

    setTimeout(() => {
        container.dataset.visible = 'yes';
        isOpen = true;
    }, 10)

    // Novācam hidden klasi no dropdown menu
    removeClass(q(container, '[data-dropdown-menu-name]'), 'hidden');

    // Pozicionē container pret input lauku
    let p = getOffset(clickTriggerEl)
    addStyle(container, {
        top: (p.top+40)+'px',
        left: p.left+'px',
    })
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