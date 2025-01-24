import { clickp, q, qr } from 'dom-helpers';

function copyToClipboard(el) {
    if (!el) {
        return
    }

    // Select the text field
    el.select();
    el.setSelectionRange(0, 99999); // For mobile devices

    if (!('clipboard' in navigator)) {
        console.error('Could not copy text: clipboard.navigator not available. Probaly your site is not served over https');
        return
    }

    // Copy the text inside the text field
    navigator.clipboard.writeText(el.value).then(() => {
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

export default {
    init() {
        clickp('[data-button-copy]', (ev, el) => {

            // Atrodam elementu, kurā veikt copy
            let copySourceEl = qr(el, el.dataset.buttonCopy);

            if (copySourceEl) {
                copyToClipboard(copySourceEl);
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