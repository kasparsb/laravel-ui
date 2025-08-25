import {replace, ensureDomNode, qr} from 'dom-helpers';
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
        this.shouldReplace = false;
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
        /**
         * TODO te ir jāsaprot vai originalEl ir tajā elementā, kurš būs jāreplaceo
         * case 1: forma, bet vajag replace formas parent elementu. Sanāk, ka form tiks replace
         */
        this.shouldReplaceOriginalEl = false;

        this.elToReplace = qr(this.elToReplace, this.originalEl.dataset.replaceHtml);
    }

    if (this.elToReplace) {
        Container.maybeLoading(this.elToReplace, 'replace');
    }
    else {
        console.error('UI.Form el to replace not defined')
    }
}

ReplaceElWithNewHtmlIfNecessary.prototype = {
    replace(newHtml) {
        if (!this.shouldReplace) {
            return false;
        }

        if (!this.elToReplace) {
            return false;
        }


        /**
         * TODO ir problēma ar replace, tas atgriež fragment, kurā
         * vairs nav elementu, jo tie ir jau pārvietoti uz jaunu location
         *
         * tāpēc šeit no response html uztaisām dom
         * izvelkam visus childs
         * un tad taisām replace
         */
        let newEl = ensureDomNode(newHtml);

        let newChilds = [...newEl.childNodes]
            // Tikai dom nodes
            .filter(el => el.nodeType === Node.ELEMENT_NODE);

        replace(this.elToReplace, newEl);

        Container.idle(newChilds);

        // Svarīgi atgriez to pašu elementu, kurš tika padots
        /**
         * Ja ir replaceHTML, tad padota tiek form, bet replace notiek uz citu elementu,
         * kurš vairs nav forma. Tāpēc šeit ir shouldReplaceOriginalEl un tiek pārbaudīts
         * vai atgriezt padoto formu
         * Bet te ir problēma, ka replceHTML gadijumā tiek padots atpakaļ
         * jau neeksitējošs elements.
         * Bet tā ir problēma, ja originalEl ir child elements, tam, kas tiek replacots
         *
         * tas, kad tagad uztaisīts ir gadījumā, ka originalEl ir ārpus replaceHTML
         * tobiš, replaceHTML ir pavisam cits elements ārpus formEl
         *
         * tad varbūt vajag pārbaudīts vai repplaceHTML nav parent formEl
         *
         */
        return newChilds;
    },
    /**
     * Vai ir jānotiek replace html
     */
    isReaplceHtml() {
        return this.shouldReplace;
    }
}

export default ReplaceElWithNewHtmlIfNecessary