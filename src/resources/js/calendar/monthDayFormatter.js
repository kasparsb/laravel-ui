import {jsx} from 'dom-helpers';

function monthDayFormatter(date, currentEl) {

    // Create new because first call
    if (!currentEl) {

        /**
         * span: šo izmantos, lai uzstādītu selected, period-in utt stāvokļus
         *
         * date elementam varēs uzlikt fona krāsu un tā netraucēs selected, period-in stilam
         * tas būs default krāsā ar opacity, lai custom fona krāsa lien ārā
         */

        return (
            <span>{date.getDate()}</span>
        )
    }

    // Update existing element
    currentEl.innerHTML = date.getDate();

    return null;
}

export default monthDayFormatter;