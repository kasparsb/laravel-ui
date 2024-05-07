import {parent, q, change} from 'dom-helpers';
import Calendar from '../Calendar';
import formatDate from './formatDate';

function getDateFromReference(referenceOrDate, onChangeCb) {

    if (!referenceOrDate) {
        return '';
    }

    if (!referenceOrDate.startsWith('calendar:')) {
        return referenceOrDate;
    }

    // reference uz citu date/calendar lauku
    let fieldName = referenceOrDate.substring(9);
    let fieldEl = q(`[name=${fieldName}]`);

    if (!fieldEl) {
        return '';
    }

    // ja ir calendar lauks
    if (parent(fieldEl, '[data-is-calendar]')) {
        // Klausāmies change pēc calendar name
        Calendar.onDateChange((calendarName, date) => {
            if (calendarName == fieldName) {
                /**
                 * To string, lai būtu tā pat, kā ar input laukiem
                 * input lauks vienmēr būs string
                 */
                onChangeCb(formatDate.ymd(date))
            }
        })
        let c = Calendar.getByName(fieldName)
        if (c) {
            /**
             * To string, lai būtu tā pat, kā ar input laukiem
             * input lauks vienmēr būs string
             */
            return formatDate.ymd(c.getDate());
        }
    }
    else {
        change(`[name=${fieldName}]`, (ev, el) => onChangeCb(el.value))
        return fieldEl.value;
    }
}

export default getDateFromReference;