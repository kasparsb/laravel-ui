import {q, r, click, change, parent, dispatchEvent} from 'dom-helpers'
import DropdownMenu from './DropdownMenu';
import FieldHoursMinutes from './FieldHoursMinutes';

function hoursMinutes(timeString) {
    return timeString.split(':').slice(0, 2).join(':');
}

function fieldDate(fieldEl) {
    return q(fieldEl, '.field-date input')
}

function fieldTime(fieldEl) {
    return q(fieldEl, '.field-increment input')
}

function fieldValue(fieldEl) {
    return q(fieldEl, 'input[type=hidden]')
}

function updateValue(fieldEl, value) {
    if (typeof value == 'undefined') {
        value = fieldDate(fieldEl).value;

        let timeValue = fieldTime(fieldEl).value;
        if (timeValue) {
            value += ' '+fieldTime(fieldEl).value+':00'
        }
    }

    fieldValue(fieldEl).value = value.trim();

    dispatchEvent(fieldValue(fieldEl), 'change');
}

function displayValue(fieldEl) {
    let value = fieldValue(fieldEl).value;
    if (!value) {
        value = '';
    }
    let p = value.split(' ');

    fieldDate(fieldEl).value = p.length > 0 ? p[0] : '';
    fieldTime(fieldEl).value = p.length > 1 ? hoursMinutes(p[1]) : '';
}

export default {
    init() {

        // Date change
        change('.field-date-time .field-date input', (ev, el) => {
            updateValue(parent(el, '.field-date-time'));
        })
        // Time change
        change('.field-date-time .field-increment input', (ev, el) => {
            updateValue(parent(el, '.field-date-time'));
        })


        /**
         * Time picker panel eventi
         */
        // Atverot time picker paneli ieliek tajā time lauka vērtību
        DropdownMenu.onOpen('timepicker', (menuEl, timeInputEl) => {
            FieldHoursMinutes.setValue(r(menuEl).hoursMinutes, timeInputEl.value)
        })

        // Time picker apply poga
        click('[data-timepicker-menu] [data-r="apply"]', (ev, buttonEl) => {
            let menuEl = DropdownMenu.getByChild(buttonEl);
            // time field no kura tika atvērts panelis
            let inputEl = DropdownMenu.getOpenTriggerByChild(buttonEl);

            inputEl.value = r(menuEl).hoursMinutes.value;

            dispatchEvent(inputEl, 'change');

            DropdownMenu.close(menuEl);
        })

        // Click on predefined hours
        click('[data-timepicker-menu] [data-r="predefinedhour"]', (ev, predefinedHourEl) => {
            let menuEl = DropdownMenu.getByChild(predefinedHourEl);

            FieldHoursMinutes.setValue(r(menuEl).hoursMinutes, predefinedHourEl.dataset.value)
        });
    },

    setValue(fieldElOrInputEl, value) {
        let fieldEl = parent(fieldElOrInputEl, '.field-date-time');
        updateValue(fieldEl, value);
        displayValue(fieldEl);
    }
}