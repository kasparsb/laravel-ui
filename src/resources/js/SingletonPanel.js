import {
    jsx, parent, append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions, isChild,
    addStyle, click, on, onMouseOverOut
} from 'dom-helpers'

/**
 * Vairāki containers pēc hierarhijas
 * pirmai atvērtais būs 0, otrais 1 utt
 */
let containers = [];

/**
 * Var tik atvērti stacked paneļi
 * no viena panel var atvērt nākošo
 * Piemēram, dropdown, kurā ir date lauks
 * data atvērs jaunu paneli, kurā būs kalendārs
 */
/**
 * onContentElRemoveCb
 * Callback, kuru izsauc, kad iepriekšējais contentEl tiek
 * izvākts no container. Tas notiek, kad tiek ielikts cits
 * contentEl
 */
let panelsStack = [
    // {
    //     contentEl
    //     onContentElRemoveCb
    //     closeWhen
    //     clickOutsideIngoredEl - elements, kurš tiks ignorēts uz click outside. Līdzīgi kā pats contentEl
    //     closeTimeout - timeout kuru uzliek aizvēršana, lai to var atcelt uz mouseover vai focusin
    //     mouseoutCloseDelay - delay pēc kāda close, ja ir mouseout
    //     focusoutCloseDelay
    // }
];

function positionByEl(panelIndex, positionEl, side, align) {
    // Pozicionē container pret input lauku
    let p = getOffset(positionEl)
    let triggerDimensions = getOuterDimensions(positionEl);
    // Content dimensions
    let menuDimensions = getOuterDimensions(getContentEl(panelIndex));

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

    addStyle(containers[panelIndex], {
        top: css.top + 'px',
        left: css.left + 'px'
    })
}

/**
 * Hierarhiski containers
 * index nāk no panelsStack masīva indeksa
 */
function createContainer(panelIndex) {
    if (typeof containers[panelIndex] == 'undefined') {
        containers[panelIndex] = (
            <div class="overlay-container"></div>
        )

        append('body', containers[panelIndex]);
    }
}

function removeContentEl(panelIndex) {
    let contentEl = getContentEl(panelIndex);

    if (!contentEl) {
        return
    }

    // novācam pazīmi, ka tas ir panel content el
    delete contentEl.dataset.singletonpanelContentEl;

    if (!panelsStack[panelIndex].onContentElRemoveCb) {
        return
    }

    panelsStack[panelIndex].onContentElRemoveCb(contentEl)
}

/**
 * Get panel content element
 */
function getContentEl(panelIndex) {
    return containers[panelIndex].firstChild
}

/**
 * Vai padotais elements atrodas panelī
 */
function isContentElInPanel(contentEl) {
    return parent(contentEl, '.overlay-container') ? true : false
}

function isClickOutsideIgnoredEl(el) {
    for (let i = 0; i < panelsStack.length; i++) {
        if (!panelsStack[i].clickOutsideIngoredEl) {
            continue;
        }

        if (panelsStack[i].clickOutsideIngoredEl === el) {
            return true;
        }
        if (isChild(panelsStack[i].clickOutsideIngoredEl, el)) {
            return true;
        }
    }
}

function close(panel) {
    containers[panel.panelIndex].dataset.visible = '';
    removeContentEl(panel.panelIndex);
}

function closeByIndex(panelIndex) {
    // visus sākot ar pirmo atrasto aizveram
    panelsStack.slice(panelIndex).forEach(panel => {
        close(panel)
    })
    // atstājam visus līdz pirmajam atrastajam
    panelsStack.splice(0, panelIndex+1);
}

function closeDelayed(panelIndex, delay) {
    panelsStack[panelIndex].closeTimeout = setTimeout(() => {
        closeByIndex(panelIndex)
    }, delay)
}

function closeOnMouseOut(panelIndex) {
    closeDelayed(panelIndex, panelsStack[panelIndex].mouseoutCloseDelay)
}

function closeOnMouseFocusOut(panelIndex) {
    closeDelayed(panelIndex, panelsStack[panelIndex].focusoutCloseDelay)
}

function handleMouseOver(contentEl) {
    let panel = panelsStack.find(p => p.contentEl === contentEl);
    if (!panel) {
        return
    }

    clearTimeout(panel.closeTimeout);
}

function handleMouseout(contentEl) {
    let panel = panelsStack.find(p => p.contentEl === contentEl);
    if (!panel) {
        return
    }

    if (panel.closeWhen === 'onmouseout') {
        closeOnMouseOut(panel.panelIndex)
    }
}

function handleFocusIn(contentEl) {
    let panel = panelsStack.find(p => p.contentEl === contentEl);
    if (!panel) {
        return
    }

    clearTimeout(panel.closeTimeout);
}

/**
 * Noticis click ārpus panel
 */
function handleClickOutside() {
    // Atrodam pirmo panel, kura ir closeWhen onclick.outside
    // aizveram to un visus nākošos paneļus
    let panelIndex = panelsStack.findIndex(panel => panel.closeWhen == 'onclick.outside');
    if (panelIndex >= 0) {
        closeDelayed(panelIndex, 10)
    }
}

function handleClose(contentEl) {
    let panel = panelsStack.find(p => p.contentEl === contentEl);
    if (!panel) {
        return
    }

    closeByIndex(panel.panelIndex)
}


export default {
    init() {
        // Mouse out from panel
        onMouseOverOut('.overlay-container [data-singletonpanel-content-el]', {
            mouseover(ev, contentEl) {
                handleMouseOver(contentEl)
            },
            mouseout(ev, contentEl) {
                handleMouseout(contentEl)
            }
        })

        // Click outside panel
        click('html', (ev) => {
            if (parent(ev.target, '[data-singletonpanel-content-el]')) {
                return
            }
            if (isClickOutsideIgnoredEl(ev.target)) {
                return
            }

            handleClickOutside();
        })

        on('focusin', '.overlay-container [data-singletonpanel-content-el]', (ev, contentEl) => {
            handleFocusIn(contentEl)
        })

        // Escape close
        on('keyup', '.overlay-container [data-singletonpanel-content-el]', (ev, contentEl) => {
            switch (ev.key) {
                case 'Escape':
                    handleClose(contentEl)
                    break;
            }
        });
    },

    /**
     * Show single instance panel
     */
    open(contentEl, {onContentElRemove, onOpen, triggerEl, side, align, closeWhen, clickOutsideIngoredEl} = {}) {

        if (isContentElInPanel(contentEl)) {
            // Clear panel stack, close all previouse panels
            for (let i = panelsStack.length-1; i >= 0; i--) {
                close(panelsStack[i]);
            }
            panelsStack = [];
        }

        let panelIndex = panelsStack.push({
            contentEl: contentEl,
            onContentElRemoveCb: onContentElRemove,
            // When to close panel
            closeWhen: closeWhen,
            clickOutsideIngoredEl: clickOutsideIngoredEl,
            closeTimeout: 0,
            mouseoutCloseDelay: 400,
            focusoutCloseDelay: 50
        }) - 1;
        panelsStack[panelIndex].panelIndex = panelIndex;

        // Pazīme, ka šis ir paneļa content elements
        contentEl.dataset.singletonpanelContentEl = '';

        createContainer(panelIndex);
        removeContentEl(panelIndex);
        replaceContent(containers[panelIndex], contentEl);

        // Ja nav timeout, tad triggerEl nepaspēs nolasīt content el dimensions
        setTimeout(() => {
            containers[panelIndex].dataset.visible = 'yes';
            if (triggerEl) {

                /**
                 * Nolasām vai ir instrukcija par pozicionēšanu
                 * Tas ir parent selector relatīvs pret triggerEl
                 */
                let positionEl = triggerEl;
                if (positionEl.dataset.dropdownMenuPositionAt) {
                    positionEl = parent(positionEl, positionEl.dataset.dropdownMenuPositionAt)
                }

                positionByEl(panelIndex, positionEl, side, align);
            }

            if (onOpen) {
                onOpen(contentEl, panelIndex)
            }
        }, 1)

        return panelIndex
    },

    close(panelIndex) {
        closeByIndex(panelIndex)
    },

    /**
     * Šo izmanto, lai uz trigger elementa mouse out aizvērtu
     * uz mouseover atvērto menu
     * Bet, ja tomēr mouse pāriet uz atvērto panel, tad
     * close tiek atcelts
     */
    closeOnMouseOut(panelIndex) {
        closeOnMouseOut(panelIndex);
    },

    closeOnMouseFocusOut(panelIndex) {
        closeOnMouseFocusOut(panelIndex)
    },
}