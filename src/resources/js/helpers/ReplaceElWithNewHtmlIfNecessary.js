import {replace, qr} from 'dom-helpers';
import DropdownMenu from '../DropdownMenu';
import Container from '../Container';

/**
 * Ja elementam ir nodrādīts data-replace-html, tad aizvietosim
 * šo elementu ar padoto html
 * ja data-replace-html ir vertība, tad tas ir relative querySelector
 * Pēc tā tiks atlasīts elements, kuru repleisot
 */
function ReplaceElWithNewHtmlIfNecessary(originalEl) {

    // Elementu nav paredzēts replaceicot ar jaunu html
    if (!('replaceHtml' in originalEl.dataset)) {
        return;
    }

    this.shouldReplace = true;

    this.originalEl = originalEl;

    /**
     * Elements, kuru replace. Normālā gadījumā, tas ir elements, kurš padots
     */
    this.elToReplace = originalEl;

    /**
     * Vai replace elements ir tas, kas oriģināli padots?
     */
    this.shouldReplaceOriginalEl = true;

    /**
     * Ja ir norādīts replaceHtml target. Tas ir cits elements, uz kuru
     * veikt replaceHtml darbību
     */
    if ('replaceHtmlTarget' in this.originalEl.dataset) {
        if (this.originalEl.dataset.replaceHtmlTarget == 'dropdownMenuOpenTrigger') {
            this.shouldReplaceOriginalEl = false;

            this.elToReplace = DropdownMenu.getOpenTriggerByChild(this.originalEl)
        }
    }

    // Ir norādīts relative querySelector ar kuru atlasīt elementu, kuru replace
    if (this.originalEl.dataset.replaceHtml) {
        this.shouldReplaceOriginalEl = false;

        this.elToReplace = qr(this.elToReplace, this.originalEl.dataset.replaceHtml);
    }

    Container.maybeLoading(this.elToReplace, 'replace');
}

ReplaceElWithNewHtmlIfNecessary.prototype = {
    replace(newHtml) {
        if (!this.shouldReplace) {
            return false;
        }

        if (!this.elToReplace) {
            return false;
        }

        this.elToReplace = replace(this.elToReplace, newHtml);

        Container.idle(this.elToReplace);

        // Svarīgi atgriez to pašu elementu, kurš tika padots
        return this.shouldReplaceOriginalEl ? this.elToReplace : this.originalEl;
    }
}

export default ReplaceElWithNewHtmlIfNecessary