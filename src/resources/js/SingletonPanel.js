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
    open(contentEl, {onContentElRemove, onOpen, positionEl, side, align} = {}) {

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
            if (positionEl) {
                positionByEl(panelIndex, positionEl, side, align);
            }

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