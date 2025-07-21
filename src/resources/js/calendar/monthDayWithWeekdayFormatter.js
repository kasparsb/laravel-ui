import {jsx, q} from 'dom-helpers';
import weekDayToText from './weekDayToText';

function weekDayCaption(date) {
    let d = date.getDay();
    if (d == 0) {
        d = 7;
    }
    return weekDayToText(d)
}

function monthDayWithWeekdayFormatter(date, currentEl) {

    // Create new because first call
    if (!currentEl) {

        /**
         * span: šo izmantos, lai uzstādītu selected, period-in utt stāvokļus
         *
         * date elementam varēs uzlikt fona krāsu un tā netraucēs selected, period-in stilam
         * tas būs default krāsā ar opacity, lai custom fona krāsa lien ārā
         */

        return (
            <span>
                <span data={{calendarWeekDate: ''}}>{date.getDate()}</span>
                <span data={{calendarWeekDay: ''}}>{weekDayCaption(date)}</span>
            </span>
        )
    }

    // Update existing element
    q(currentEl, '[data-calendar-week-date]').innerHTML = date.getDate();
    q(currentEl, '[data-calendar-week-day]').innerHTML = weekDayCaption(date);

    return null;
}

export default monthDayWithWeekdayFormatter;