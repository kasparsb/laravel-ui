import {
    jsx, parent, append, replaceContent, addStyle,
    getOffset, getOuterDimensions, getWindowDimensions
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
    //     closeTimeout - timeout kuru uzliek aizvēršana, lai to var atcelt uz mouseover vai focusin
    //     mouseoutCloseDelay - delay pēc kāda close, ja ir mouseout
    //     focusoutCloseDelay
    // }
];

/**
 * Main goal ir pozicionēt neizmantojot getContentEl(panelIndex) dimensions
 */
function positionByEl(panelIndex, positionEl, x, y, side, align) {

    let gap = 4;

    let pos = {
        x: x ? x : 0,
        y: y ? y : 0,
    }

    // Ir konkrēts elements pret kuru pozicionēt
    if (positionEl) {
        let positionElPosition = getOffset(positionEl)
        let triggerDimensions = getOuterDimensions(positionEl);
        let windowDimensions = getWindowDimensions();

        if (side == 'bottom' || side == 'top') {

            if (side == 'bottom') {
                pos.y = (positionElPosition.top + triggerDimensions.height + gap);
            }
            else {
                pos.y = (windowDimensions.height - positionElPosition.top + gap);
            }

            if (align == 'left') {
                pos.x = positionElPosition.left;
            }
            else if (align == 'right') {
                pos.x = windowDimensions.width - positionElPosition.left - triggerDimensions.width;
            }
        }
    }

    let css = {};
    switch (side+align) {
        case 'topright':
            css = {
                top: 0,
                left: 0,
                bottom: pos.y+'px',
                right: pos.x+'px'
            }
            break;
        case 'topleft':
            css = {
                top: 0,
                left: pos.x+'px',
                bottom: pos.y+'px',
                right: 0
            }
            break;
        case 'bottomright':
            css = {
                top: pos.y+'px',
                left: 0,
                bottom: 0,
                right: pos.x+'px'
            }
            break;
        case 'bottomleft':
            css = {
                top: pos.y+'px',
                left: pos.x+'px',
                bottom: 0,
                right: 0
            }
            break;
    }

    containers[panelIndex].dataset.side = side
    containers[panelIndex].dataset.align = align

    addStyle(containers[panelIndex], css)
}

/**
 * Hierarhiski containers
 * index nāk no panelsStack masīva indeksa
 */
function createContainer(panelIndex) {
    if (typeof containers[panelIndex] == 'undefined') {
        containers[panelIndex] = (
            <div class="overlay-container" hidden></div>
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

function close(panel) {
    containers[panel.panelIndex].hidden = true;
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

export default {
    /**
     * Show single instance panel
     */
    open(contentEl, {onContentElRemove, onOpen, positionEl, x, y, side, align} = {}) {

        let panelIndex = panelsStack.push({
            contentEl: contentEl,
            onContentElRemoveCb: onContentElRemove,
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

        if (onOpen) {
            onOpen(contentEl, panelIndex)
        }

        // Ja nav timeout, tad var nepaspēt nolasīt content el dimensions
        setTimeout(() => {
            positionByEl(panelIndex, positionEl, x, y, side, align);

            // Padaram redzamu
            containers[panelIndex].hidden = false;
        })

        return panelIndex
    },

    close(panelIndex) {
        if (typeof panelIndex != 'undefined') {
            closeByIndex(panelIndex)
        }
    },

    /**
     * Close all panels stack
     */
    closeAll() {
        if (panelsStack.length == 0) {
            return;
        }

        // First panel
        let panel = panelsStack.find(() => true);
        closeByIndex(panel.panelIndex)
    },

    hasChild(panelIndex) {
        panelIndex = parseInt(panelIndex, 10)
        let i = panelsStack.findIndex(panel => panel.panelIndex == panelIndex)

        return i+1 < panelsStack.length
    },

    getParent(panelIndex) {
        let i = panelsStack.findIndex(panel => panel.panelIndex == panelIndex);
        if (i > 0) {
            return panelsStack[i-1]
        }
        return null;
    },

    getStack() {
        return panelsStack
    }
}