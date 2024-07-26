import {
    jsx, q, qa, parent, isChild,
    append, replaceContent,
    on, dispatchEvent
} from 'dom-helpers';
import BaseCalendar from 'calendar';
import weekDayToText from './calendar/weekDayToText';
import dateCaptionFormatter from './calendar/dateCaptionFormatter';
import navPrevFormatter from './calendar/navPrevFormatter';
import navNextFormatter from './calendar/navNextFormatter';
import monthDayFormatter from './calendar/monthDayFormatter';
import getDateFromReference from './calendar/getDateFromReference';
import getJsonFromHtml from './helpers/getJsonFromHtml';
import clampDate from './calendar/clampDate';
import formatDate from './calendar/formatDate';
import DropdownMenu from './DropdownMenu';

function sp(s) {
    s = s+'';
    if (s.length == 1) {
        s = '0'+s;
    }
    return s;
}

function ymd(date) {
    return date.getFullYear()+'-'+sp(date.getMonth()+1)+'-'+sp(date.getDate());
}

let calendar;
let container;
let activeField;
let isOpen = false;

function createCalendar(date) {
    return new BaseCalendar.dom(date, {
        //cssprefix: '',
        view: 'month',
        count: 1,
        showWeekdays: true,
        showDateSwitch: true,
        showToday: true,

        // Vai ļaut klikšķināt uz prev/next month datumiem
        disablePrevMonthDate: true,
        disableNextMonthDate: true,

        // pazīme, ka jāļauj atzīmēt period
        // selectPeriod: true,
        // selectedPeriod: {
        //     from: new Date('2023-05-10 00:00:00'),
        //     till: new Date('2023-05-22 23:59:59')
        // },
        monthDayFormatter: monthDayFormatter,
        weekDayToText: weekDayToText,
        dateCaptionFormatter: dateCaptionFormatter,
        navPrevFormatter: navPrevFormatter,
        navNextFormatter: navNextFormatter
    })
}

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar() {
    if (!container) {
        container = q('[data-field-date-calendar-container]')
    }

    if (!calendar) {
        calendar = createCalendar(new Date());
        /**
         * Tieši, kad lietotājs izvēlējies datumu
         * tāpēc te nav change, bet ir dateclick
         */
        calendar.on('dateclick', dateSelected)

        replaceContent(container, calendar.getEl());
    }
}

function dateSelected(date) {
    if (!activeField) {
        return;
    }

    activeField.value = ymd(date);

    /**
     * Šo tālāk pārbaudīt focusin, lai atkārtoti nerādītu kalendāru
     */
    wasSetDateInInputFromCalendar = true;
    activeField.focus();

    dispatchEvent(activeField, 'change')

    activeField = null;

    isOpen = false;

    // ja aizvērts ar esc, bet lauks vēl fokusā, tad ļaujam uz click tomēr nostrādāt
    wasFocusin = false;
}

function setupCalendar(field) {

    maybeCreateContainerAndCalendar()

    activeField = field;

    // timeout vajadzīgs, jo kalendārs vēl nav paspējis pilnībā izveidoties un setStateUrl būs error
    setTimeout(() => {
        // Default date state
        calendar.setDefaultDateState(getJsonFromHtml(parent(activeField, '.field-date'), 'default-date-state'));
        // State
        calendar.setState(getJsonFromHtml(parent(activeField, '.field-date'), 'state'));

        // State url
        calendar.setStateUrl(field.dataset.stateUrl ? field.dataset.stateUrl : '');

        calendar.setDate(new Date());

        // Min max date
        calendar.setMinDate(field.dataset.minDate);
        calendar.setMaxDate(field.dataset.maxDate);

        // Current date
        calendar.setSelectedDate(activeField.value);

        calendar.scrollFirstAvailableDateIntoViewport();

    }, 10)
}

function validateFieldValue(inputFieldEl) {
    // ja nav vērtības ko validēt, tad bail
    if (!inputFieldEl.value) {
        return
    }

    let clampedValue = formatDate.ymd(clampDate(inputFieldEl.value, inputFieldEl.dataset.minDate, inputFieldEl.dataset.maxDate));
    if (clampedValue != inputFieldEl.value) {
        inputFieldEl.value = clampedValue;

        dispatchEvent(inputFieldEl, 'change')
    }
}

let wasSetDateInInputFromCalendar = false;
let wasFocusin = false;

export default {
    init() {

        DropdownMenu.onOpen('field-date-calendar', (menuEl, triggerEl) => {
            setupCalendar(triggerEl)
        })



        /**
         * Visiem field-date uzstādām min|max date no
         * reference lauka. Klausāmies uz reference lauka izmaiņām,
         * lai uzsetotu atjaunoto min|max date
         * Validējam, lai lauka vērtība atbilstu min|max date
         *
         * Kad tiek atvērts kalendārs, tad min|max vērtības tiek
         * ņemtas no input lauka
         */
        qa('.field-date').forEach(fieldDateEl => {
            let inputEl = q(fieldDateEl, 'input');

            // Liekam data atribūtu min|max Date. Nolasām no related lauka
            inputEl.dataset.minDate = getDateFromReference(inputEl.dataset.minDate, minDate => {
                inputEl.dataset.minDate = minDate

                validateFieldValue(inputEl);
            })
            inputEl.dataset.maxDate = getDateFromReference(inputEl.dataset.maxDate, maxDate => {
                inputEl.dataset.maxDate = maxDate

                validateFieldValue(inputEl);
            })
        })
    }
}