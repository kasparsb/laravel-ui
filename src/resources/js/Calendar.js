import {jsx, q, qa, parent, append, get} from 'dom-helpers';
import BaseCalendar from 'calendar';
import weekDayToText from './calendar/weekDayToText';
import stringToDate from './calendar/stringToDate';
import formatDate from './calendar/formatDate';
import dateCaptionFormatter from './calendar/dateCaptionFormatter';
import navPrevFormatter from './calendar/navPrevFormatter';
import navNextFormatter from './calendar/navNextFormatter';
import monthDayFormatter from './calendar/monthDayFormatter';
import getJsonFromHtml from './helpers/getJsonFromHtml';
import Listeners from './helpers/Listeners';

function CalendarWrapper(containerEl) {

    this.containerEl = containerEl;

    // Vai ir period select
    this.isPeriod = containerEl.dataset.period == 'yes';

    this.actionOnDateSelect = containerEl.dataset.onDateSelect;

    /**
     * Šie lauki ir vienmēr. By default bez name. Ja padots name, tad ar name
     */
    // Single date lauks
    this.dateInputField = q(this.containerEl, 'input[data-role="date"]');
    // Period lauki
    this.fromInputField = q(this.containerEl, 'input[data-role="from"]');
    this.tillInputField = q(this.containerEl, 'input[data-role="till"]');

    let firstDate = new Date();

    // Nolasām firstData no input laukie, ja tajos ir vērtības
    if (this.isPeriod) {
        if (this.fromInputField.value) {
            firstDate = stringToDate(this.fromInputField.value);
        }
    }
    else {
        if (this.dateInputField.value) {
            firstDate = stringToDate(this.dateInputField.value);
        }
    }

    let calendarProps = {
        //cssprefix: '',
        view: 'month',
        count: 1,
        showWeekdays: true,
        showDateSwitch: true,
        showToday: true,
        showSelectedDate: true,
        selectPeriod: this.isPeriod,

        // Vai ļaut klikšķināt uz prev/next month datumiem
        disablePrevMonthDate: true,
        disableNextMonthDate: true,

        monthDayFormatter: monthDayFormatter,
        weekDayToText: weekDayToText,
        dateCaptionFormatter: dateCaptionFormatter,
        navPrevFormatter: navPrevFormatter,
        navNextFormatter: navNextFormatter,
    }

    // State
    let state = getJsonFromHtml(this.containerEl, 'state');
    if (state) {
        calendarProps.state = state;
    }

    // Default date state
    let defaultDateState = getJsonFromHtml(this.containerEl, 'default-date-state');
    if (defaultDateState) {
        calendarProps.defaultDateState = defaultDateState;
    }

    if (containerEl.dataset.stateUrl) {
        calendarProps.stateUrl = containerEl.dataset.stateUrl;
    }

    if (containerEl.dataset.minDate) {
        if (containerEl.dataset.minDate.startsWith('calendar:')) {
            calendarProps.minDate = watchDateFromCalendarByName(containerEl.dataset.minDate.substring(9), (minDate) => {
                this.calendar.setMinDate(minDate);
            })
        }
        else {
            calendarProps.minDate = containerEl.dataset.minDate;
        }
    }

    if (containerEl.dataset.maxDate) {
        if (containerEl.dataset.maxDate.startsWith('calendar:')) {
            calendarProps.maxDate = watchDateFromCalendarByName(containerEl.dataset.maxDate.substring(9), (maxDate) => {
                this.calendar.setMaxDate(maxDate);
            })
        }
        else {
            calendarProps.maxDate = containerEl.dataset.maxDate;
        }
    }

    this.calendar = new BaseCalendar.dom(firstDate, calendarProps);

    if (this.isPeriod) {
        if (this.fromInputField.value && this.tillInputField.value) {
            this.calendar.setSelectedPeriod({
                from: stringToDate(this.fromInputField.value),
                till: stringToDate(this.tillInputField.value)
            });
        }
    }
    else {
        if (this.dateInputField.value) {
            this.calendar.setSelectedDate(firstDate);
        }
    }

    // Ja ir date input field, tad uz dateclick ieliksim to datumu laukā
    if (this.dateInputField) {
        this.calendar.on('dateclick', date => {
            this.dateInputField.value = formatDate.ymd(date)

            if (this.actionOnDateSelect == 'submit') {
                // Atrodam parent formu un submit
                let form = parent(this.containerEl, 'form');
                if (form) {
                    form.submit();
                }
            }
        })
    }

    if (this.fromInputField || this.tillInputField) {
        this.calendar.on('periodselect', period => {
            if (this.fromInputField) {
                this.fromInputField.value = formatDate.ymd(period.from)
            }
            if (this.tillInputField) {
                this.tillInputField.value = formatDate.ymd(period.till)
            }
        })
    }

    // Append, jo containerEl var būt iekšā date input field
    append(this.containerEl, this.calendar.getEl());
}

/**
 * Nolasām un klausāmies datumu no kalendāra pēc tā vārda
 */
function watchDateFromCalendarByName(watchCalendarName, cb) {
    onChangeListeners.listen((calendarName, date) => {
        if (watchCalendarName != calendarName) {
            return;
        }

        cb(date);
    })

    let calendar = findCalendarByName(watchCalendarName);
    if (calendar) {
        return calendar.getDate();
    }
    else {
        /**
         * kalendārs vēl nav reģistrēts
         * klausāmies uz event, kad tas tiks piereģistrēts
         */
        onCreateListeners.listen((calendarName, calendar) => {
            if (watchCalendarName != calendarName) {
                return;
            }

            cb(calendar.getDate())
        })
    }
}




function findCalendarByName(calendarName) {
    let instance = instances.find(instance => instance.name == calendarName);
    return instance ? instance.calendarWrapper.calendar : null;
}

let instances = [];

let onCreateListeners = new Listeners();
let onChangeListeners = new Listeners();

export default {
    init() {
        [...qa('.calendar')].forEach(calendarEl => {
            let calendarWrapper = new CalendarWrapper(calendarEl);
            let newLength = instances.push({
                name: calendarEl.dataset.name,
                calendarWrapper: calendarWrapper
            });
            calendarEl.dataset.calid = newLength - 1;

            calendarWrapper.calendar.on('dateclick', date => {
                onChangeListeners.trigger([calendarEl.dataset.name, date])
            })

            onCreateListeners.trigger([calendarEl.dataset.name, calendarWrapper.calendar])
        })

        // Register method to get calendar instance by name
        window.uiGetCalendarByName = function(name){
            return findCalendarByName(name)
        }
    }
};