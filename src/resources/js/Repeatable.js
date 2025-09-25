import {
    q, qa, parent, ce,
    insertAfter, replace, clone, remove, append,
    get
} from 'dom-helpers';
import Listeners from './helpers/Listeners';

let onAfterNewItemListeners = {};
let onDeleteItemListeners = {};

function getDeletedFieldEl(itemEl) {
    let repeatableEl = parent(itemEl, '[data-repeatable-container]')

    if (!('repeatableDeletedFieldSelector' in repeatableEl.dataset)) {
        return false;
    }

    if (!repeatableEl.dataset.repeatableDeletedFieldSelector) {
        return false;
    }


    return q(itemEl, repeatableEl.dataset.repeatableDeletedFieldSelector)
}

function getIdFieldEl(itemEl) {
    let repeatableEl = parent(itemEl, '[data-repeatable-container]')

    if (!('repeatableIdFieldSelector' in repeatableEl.dataset)) {
        return false;
    }

    if (!repeatableEl.dataset.repeatableIdFieldSelector) {
        return false;
    }


    return q(itemEl, repeatableEl.dataset.repeatableIdFieldSelector)
}

function getNewItemPlaceholderEl(repeatableEl, newItemIndex) {

    let placeholderEl;

    // šajā glabājas user defined placeholder el
    let placeholderContainerEl = q(repeatableEl, '[data-repeatable-new-item-placeholder]');
    if (placeholderContainerEl) {
        for (let i = 0; i < placeholderContainerEl.childNodes.length; i++) {
            if (placeholderContainerEl.childNodes[i].nodeType != Node.ELEMENT_NODE) {
                continue;
            }

            // Klonējam, jo šis tiks aizvietots ar īsto repeatable item
            // tāpēc, lai nepazaudētu placeholderEl vajag klonēt
            placeholderEl = clone(placeholderContainerEl.childNodes[i]);

            break;
        }
    }

    if (!placeholderEl) {
        /**
         * Ja nav, tad atgriežam div, kurš ir hidden
         * normālā gadījumā blade pusē tiks izveidots div hidden
         * šis ir tikai pats pēdējais resort
         */
        placeholderEl = ce('div', {hidden: 'hidden'})
    }

    placeholderEl.dataset.repeatableItem = newItemIndex;

    return placeholderEl;
}

function getLastItem(repeatableEl) {
    /**
     * Visi izņemot deleted
     * bet tā nevar darīt, jo tad dublēsies index ar tiem item, kuri nav deleted
     * piemēram izdzēš ar index=2 un tā vietā uztaisa jaunu ar index=2
     *
     * TODO ja nav data-deleted-field-selector, tad laikam gan var ņemt tikai nedzēstos
     *
     */
    let allItems;
    if (repeatableEl.dataset.repeatableIdFieldSelector) {
        allItems = [...qa(repeatableEl, '[data-repeatable-item]')];
    }
    else {
        allItems = [...qa(repeatableEl, '[data-repeatable-item]:not([data-repeatable-item-deleted])')];
    }

    // Nav neviena repeatable item
    if (allItems.length == 0) {
        return null
    }

    let lastItemEl = allItems.at(-1);

    if (!lastItemEl) {
        return null;
    }

    let index = parseInt(lastItemEl.dataset.repeatableItem, 10);
    if (isNaN(index)) {
        index = allItems.length;
    }

    return {
        el: lastItemEl,
        index: index
    }
}

function addNewItem(repeatableEl) {

    if (!('newItemLink' in repeatableEl.dataset)) {
        return;
    }
    if (!repeatableEl.dataset.newItemLink) {
        return;
    }

    let newItemPlaceholderEl;
    let newItemIndex;

    // Atlasam pēdējo repeatable item
    let lastItem = getLastItem(repeatableEl);

    if (lastItem) {
        newItemIndex = lastItem.index+1;
        newItemPlaceholderEl = getNewItemPlaceholderEl(repeatableEl, newItemIndex)
        insertAfter(lastItem.el, newItemPlaceholderEl);
    }
    // nav neviena item
    else {

        newItemIndex = 0;

        /**
         * izmantojam [data-repeatable-blank-item]
         * šis ir user defined elements, kurš ir novietots vietā, kurā ir jāliek repeatable items
         */
        let blankItemEl = q(repeatableEl, '[data-repeatable-blank-item]');
        if (blankItemEl) {
            newItemPlaceholderEl = getNewItemPlaceholderEl(repeatableEl, newItemIndex);
            replace(blankItemEl, newItemPlaceholderEl);
        }
    }

    if (!newItemPlaceholderEl) {
        return;
    }

    replace(newItemPlaceholderEl, get(repeatableEl.dataset.newItemLink, {
        index: newItemIndex
    }))
        .then(newItemEl => {

            repeatableEl.dataset.repeatableState = '';

            if (onAfterNewItemListeners['__any__']) {
                onAfterNewItemListeners['__any__'].trigger([
                    newItemEl
                ])
            }
        })
}

function deleteItem(childEl) {
    let repeatableEl = parent(childEl, '[data-repeatable-container]')
    let itemEl = parent(childEl, '[data-repeatable-item]')

    // Ja ir track deleted, tad uzliekam input lauku _deleted
    let deletedFieldEl = getDeletedFieldEl(itemEl);
    if (deletedFieldEl) {
        deletedFieldEl.value = '_deleted';

        /**
         * Pārbaudām vai ir id field. ja ir tad liekam pazīmi, ka ir dzēsts,
         * bet fiziski item nedzēšam ārā
         */
        let idFieldEl = getIdFieldEl(itemEl);
        if (idFieldEl && idFieldEl.value) {
            itemEl.dataset.repeatableItemDeleted = '';

            if (onDeleteItemListeners['__any__']) {
                onDeleteItemListeners['__any__'].trigger([
                    repeatableEl
                ])
            }

            return;
        }
    }


    let currentItemEls = qa(repeatableEl, '[data-repeatable-item]');

    /**
     * jāpārbauda vai šis repeatable item ir pēdējais
     * ja ir pēdējais, tad to vajag aizstāt ar [data-repeatable-new-item-placeholder],
     * lai tā vietā var ielikt jaunu item
     */
    if (currentItemEls.length == 1) {

        repeatableEl.dataset.repeatableState = 'empty';

        // atrodam vai ir [data-repeatable-blank-item]
        // tas ir user defined item, kurš atrodas vietā, kur jābūt repeatable items
        let blankItemEl = q(repeatableEl, '[data-repeatable-blank-item]');
        if (blankItemEl) {
            remove(itemEl);
        }
        else {
            // izveidojam blank-item-el, kuru ievietojam pēdējā dzēšamā itemEl vietā
            blankItemEl = ce('div');
            blankItemEl.dataset.repeatableBlankItem = '';
            replace(itemEl, blankItemEl);
        }
    }
    else {
        remove(itemEl);
    }

    if (onDeleteItemListeners['__any__']) {
        onDeleteItemListeners['__any__'].trigger([
            repeatableEl
        ])
    }
}

export default {
    init() {

    },
    onAfterNewItem(cb) {
        if (typeof onAfterNewItemListeners['__any__'] == 'undefined') {
            onAfterNewItemListeners['__any__'] = new Listeners();
        }
        onAfterNewItemListeners['__any__'].listen(cb);
    },
    /**
     * šīs pogas izsauks šo metodi
     * data-button-add="repeatableItem"
     */
    addItem(buttonEl) {
        addNewItem(parent(buttonEl, '[data-repeatable-container]'))
    },
    deleteItem(buttonEl) {
        deleteItem(buttonEl);
    },
    onDeleteItem(cb) {
        if (typeof onDeleteItemListeners['__any__'] == 'undefined') {
            onDeleteItemListeners['__any__'] = new Listeners();
        }
        onDeleteItemListeners['__any__'].listen(cb);
    }
}