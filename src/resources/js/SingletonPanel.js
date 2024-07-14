import {
    jsx, q, append, replaceContent,
    getOffset, getOuterDimensions, getWindowDimensions,
    addStyle,
} from 'dom-helpers'

let container;

/**
 * Callback, kuru izsauc, kad iepriekšējais contentEl tiek
 * izvākts no container. Tas notiek, kad tiek ielikts cits
 * contentEl
 */
let onPrevContentElRemoveCb;

function positionByEl(positionEl, side, align) {
    // Pozicionē container pret input lauku
    let p = getOffset(positionEl)
    let triggerDimensions = getOuterDimensions(positionEl);
    // Content dimensions
    let menuDimensions = getOuterDimensions(getContentEl());

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
}

/**
 * Get panel content element
 */
function getContentEl() {
    return container.firstChild
}

function createContainer() {
    if (!container) {
        container = (
            <div class="overlay-container"></div>
        )

        append('body', container);
    }
}

function removeContentEl() {
    let currentContentEl = getContentEl();
    if (currentContentEl) {
        if (onPrevContentElRemoveCb) {
            onPrevContentElRemoveCb(currentContentEl)
        }
    }
}

export default {
    /**
     * Show single instance panel
     */
    show(contentEl, {onContentElRemove, positionEl, side, align} = {}) {

        createContainer();
        removeContentEl();
        replaceContent(container, contentEl);

        onPrevContentElRemoveCb = onContentElRemove;

        // Ja nav timeout, tad positionByEl nepaspēs nolasīt content el dimensions
        setTimeout(() => {
            container.dataset.visible = 'yes';
            if (positionEl) {
                positionByEl(positionEl, side, align);
            }
        }, 1)
    },

    close() {
        container.dataset.visible = '';
        removeContentEl();
    },

    getContentEl() {
        return getContentEl();
    },

    getEl() {
        return container;
    }
}