import {
    jsx, qa, parent, append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions, isChild,
    addStyle, click, on, onMouseOverOut
} from 'dom-helpers'



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
        if (isChild(el, panelsStack[i].clickOutsideIngoredEl)) {
            return true;
        }
    }
}

function close(panel) {
    containers[panel.panelIndex].dataset.visible = '';
    removeContentEl(panel.panelIndex);
}

function closeByIndex(panelIndex) {
    /**
     * Liek timeout, lai izpildās nākošajā tick
     * ja tiek aizvērts uz click, tad nepaspēs nostrādāt
     * šeit uzliktais click.outside
     * sanāks situācija, kad click.outside saņems ev.target
     * kurš jau ir izņemts no panel
     */
    setTimeout(() => {
        // visus sākot ar pirmo atrasto aizveram
        panelsStack.slice(panelIndex).forEach(panel => {
            close(panel)
        })
        // atstājam visus līdz pirmajam atrastajam
        panelsStack.splice(panelIndex);
    }, 1)
}

function closeDelayed(panelIndex, delay) {
    panelsStack[panelIndex].closeTimeout = setTimeout(() => {
        closeByIndex(panelIndex)
    }, delay)
}

function closeOnMouseOut(panelIndex) {
    closeDelayed(panelIndex, panelsStack[panelIndex].mouseoutCloseDelay)
}

function closeOnFocusOut(panelIndex) {
    closeDelayed(panelIndex, panelsStack[panelIndex].focusoutCloseDelay)
}

/**
 * No target input lauka notiek Tab ar kuru iet uz nākošo lauku
 * ja ir panelis atvērts, tad vajag lai iefokusējas pirmais lauks
 * ja tāda nav, tad aizver ciet
 *
 * Vēl ir jāpieglabā pazīme, ka šāds scenācijas bija un
 * kad notiek focusout no paneļa, tad vajag iefokusēt nākošo
 * elementu aiz target input elementa
 *
 * Līdzi nāk event, lai to varētu atcelt, ja it iefokusēts pirmais,
 * pretējā gadījumā notiek iefokusēšana un nostrādā Tab līdz galam
 * un pārlec uz nākošo elementu
 */
function closeOnFocusOutOrFocusFirst(panelIndex, callbacks) {
    // Atrodam vai panelī ir focusable elements
    let firstFocusable = findFirstFocusable(panelsStack[panelIndex].contentEl)
    if (firstFocusable) {
        firstFocusable.focus();
        if (callbacks && callbacks.focusFirst) {
            callbacks.focusFirst(firstFocusable);
        }
    }
    else {
        closeDelayed(panelIndex, panelsStack[panelIndex].focusoutCloseDelay)
        if (callbacks && callbacks.close) {
            callbacks.close(firstFocusable);
        }
    }
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

/**
 * Aizver visus panels, kuri ir atvērti no šī panel
 */
function handleCloseAllChildPanels(contentEl) {
    let panelInedx = panelsStack.findIndex(p => p.contentEl === contentEl);

    // Aizveram visus child panels
    if (panelInedx + 1 < panelsStack.length) {

        closeByIndex(panelInedx + 1)
    }

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
            if (isClickOutsideIgnoredEl(ev.target)) {
                return
            }

            let contentEl = parent(ev.target, '[data-singletonpanel-content-el]');
            if (contentEl) {


                /**
                 * TODO Šitas vēl jāpārdomā
                 * ja tagad taisa ciet, tad ciet taisīšanas notiek arī uz
                 * triggerEl
                 * iespējams vajag skatīties vai ir open
                 * es te nezinu vai tas uz kura noklišķināja atvērs citu paneli
                 *
                 * Varbūt šis ir speciāli jāpārnes uz DropDown menu un tur jāskatās
                 * jo tur ir zināms, kurš atvērs jaunu paneli un kurš ir tikai kliks uz panel
                 */

                // Jāaizver visi panels virs ši panel, kurā notika click
                //handleCloseAllChildPanels(contentEl);


                return
            }

            handleClickOutside();
        })

        on('mousedown', '.overlay-container [data-singletonpanel-content-el]', (ev, contentEl) => {
            contentEl.dataset.singletonpanelWasMouseDown = '';
        })

        let focusoutTImeout = 0;
        // lokālais focusout kontrolēs, ka ir bijis focusout no kāda no elementiem
        on('focusout', '.overlay-container [data-singletonpanel-content-el]', (ev, contentEl) => {
            focusoutTImeout = setTimeout(() => {
                if ('singletonpanelWasMouseDown' in contentEl.dataset) {
                    delete contentEl.dataset.singletonpanelWasMouseDown
                }
                else {
                    handleClose(contentEl)
                }
            }, 5)
        })
        // lokālais focusin, atcelts aizvēršanas timeout
        on('focusin', '.overlay-container [data-singletonpanel-content-el]', (ev, contentEl) => {
            clearTimeout(focusoutTImeout);
            handleFocusIn(contentEl)
        })

    },

    /**
     * Show single instance panel
     */
    open(contentEl, {onContentElRemove, onOpen, triggerEl, side, align, closeWhen, clickOutsideIngoredEl} = {}) {

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

    closeOnFocusOut(panelIndex) {
        closeOnFocusOut(panelIndex)
    },

    closeOnFocusOutOrFocusFirst(panelIndex, callbacks) {
        closeOnFocusOutOrFocusFirst(panelIndex, callbacks)
    }
}