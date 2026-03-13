import { clickp, q, qr } from 'dom-helpers';
import DropdownMenu from './DropdownMenu';
import Repeatable from './Repeatable';

function isInputField(el) {
    switch (el.tagName) {
        case 'INPUT':
        case 'TEXTAREA':
            return true;
    }
    return false;
}

function copyToClipboard(el) {
    if (!el) {
        return
    }

    if (!('clipboard' in navigator)) {
        console.error('Could not copy text: clipboard.navigator not available. Probaly your site is not served over https');
        return
    }

    let elText = '';
    if (isInputField(el)) {

        // šis ir gadījumam, ja nav pieejams navigator.clipboard
        //el.select();
        //el.setSelectionRange(0, 99999); // For mobile devices
        //document.execCommand("copy");

        elText = el.value;
    }
    else {
        elText = el.innerHTML;
    }

    // Copy the text inside the text field
    navigator.clipboard.writeText(elText)
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
}

export default {
    init() {
        clickp('[data-button-copy]', (ev, buttonEl) => {

            switch (buttonEl.dataset.buttonCopy) {
                case 'repeatableItem':
                    if (('buttonAsTarget' in buttonEl.dataset) && buttonEl.dataset.buttonAsTarget == 'dropdownMenuOpenTrigger') {
                        Repeatable.copyItem(DropdownMenu.getOpenTriggerByChild(buttonEl))
                    }
                    else {
                        Repeatable.copyItem(buttonEl)
                    }
                    break;
                default:
                    // Atrodam elementu, kurā veikt copy
                    let copySourceEl = qr(buttonEl, buttonEl.dataset.buttonCopy);

                    if (copySourceEl) {
                        copyToClipboard(copySourceEl);
                    }
                    break;
                }
        })
    },
    isButtonCopy(el) {
        if ('buttonCopy' in el.dataset) {
            return true;
        }
        return false;
    }
}