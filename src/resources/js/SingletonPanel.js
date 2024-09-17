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

function parseDirection(dir) {
    if (!dir) {
        dir = 'right bottom'
    }
    let dirParts = dir.split(' ');

    return {
        x: dirParts[0],
        y: dirParts[1]
    }
}

/**
 * Main goal ir pozicionēt neizmantojot panelī
 * ieliktā elementa (getContentEl(panelIndex)) dimensions
 */
function positionByEl(panelIndex, positionEl, positionElDir, x, y, dir, xOffset, yOffset) {

    let windowDimensions = getWindowDimensions();

    xOffset = parseInt(xOffset, 10);
    if (isNaN(xOffset)) {
        xOffset = 0;
    }
    yOffset = parseInt(yOffset, 10);
    if (isNaN(yOffset)) {
        yOffset = 0;
    }

    console.log('Offset', xOffset, yOffset);

    let pos = {
        x: x ? x : 0,
        y: y ? y : 0,
    }

    console.log('start pos', pos);
    console.log('positionEl', positionEl);

    // Elements pret kuru noteikt pos.x un pos.y
    // šis overraid padotos x un y
    if (positionEl) {
        let positionElPosition;
        let positionElDimensions;
        if (positionEl == 'viewport') {
            positionElPosition = {top: 0, left: 0}
            positionElDimensions = {
                width: windowDimensions.width,
                height: windowDimensions.height,
            }
        }
        else {
            positionElPosition = getOffset(positionEl)
            positionElDimensions = getOuterDimensions(positionEl);
        }

        console.log(positionElPosition, positionElDimensions    );

        pos.x = positionElPosition.left;
        pos.y = positionElPosition.top;

        console.log('positionElPos', pos);

        // Position el stūris pēc kura noteikt pos.x un pos.y
        positionElDir = parseDirection(positionElDir);

        console.log('positionElDir', positionElDir);

        if (positionElDir.x == 'right') {
            pos.x += positionElDimensions.width;
        }
        if (positionElDir.y == 'bottom') {
            pos.y += positionElDimensions.height;
        }

        console.log('positionElPosAdjusted', pos);
    }

    // Pieliekam offset
    pos.x += xOffset;
    pos.y += yOffset;

    /**
     * Atkarībā no direction vajag konvertēt pos.x un pos.y uz
     * css top left bottom right
     *
     * Ja x virziens ir left, tad pos.x ir jākonvertē uz css right
     * Ja y virziens ir top, tad pos.y ir jākonvertē uz css bottom
     */
    dir = parseDirection(dir);
    if (dir.x == 'left') {
        pos.x = windowDimensions.width - pos.x;
    }
    if (dir.y == 'top') {
        pos.y = windowDimensions.height - pos.y;
    }

    let css = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    if (dir.x == 'left') {
        css.right = pos.x+'px';
    }
    if (dir.x == 'right') {
        css.left = pos.x+'px';
    }
    if (dir.y == 'top') {
        css.bottom = pos.y+'px';
    }
    if (dir.y == 'bottom') {
        css.top = pos.y+'px';
    }

    console.log('dir', dir);
    console.log('css', css);
    containers[panelIndex].dataset.dir = dir.x+dir.y

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
    open(contentEl, {onContentElRemove, onOpen, positionEl, positionElDir, x, y, dir, xOffset, yOffset} = {}) {

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
            positionByEl(
                panelIndex,

                positionEl,
                positionElDir,
                x,
                y,
                dir,
                xOffset,
                yOffset
            );

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