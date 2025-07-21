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
import InputValuePreview from './InputValuePreview';
import stringToDate from './calendar/stringToDate';

let calendar;
let container;
let activeField;
let activeMenu;

let namedListeners = {}

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

    if ('datePickerSetSelectedDate' in activeField.dataset) {
        setDate(activeField, date);
        setPlaceholder(activeField, date);
    }

    if ('fieldDateCalendarListenerName' in activeField.dataset) {
        if (typeof namedListeners[activeField.dataset.fieldDateCalendarListenerName] != 'undefined') {
            namedListeners[activeField.dataset.fieldDateCalendarListenerName](date);
        }
    }

    DropdownMenu.close(activeMenu);
}

function setupCalendar(field) {

    maybeCreateContainerAndCalendar()

    // timeout vajadzīgs, jo kalendārs vēl nav paspējis pilnībā izveidoties un setStateUrl būs error
    setTimeout(() => {


        // Elements, kurā glabājas date state json
        // parasti wrapper elements, kurā ir poga/input lauks, kurš izsauc date picker
        let stateContainerEl = parent(activeField, '[data-date-picker-triggr-el-container]');
        if (stateContainerEl) {
            // Default date state
            calendar.setDefaultDateState(getJsonFromHtml(stateContainerEl, 'default-date-state'));
            // State
            calendar.setState(getJsonFromHtml(stateContainerEl, 'state'));
        }
        else {
            // Default date state
            calendar.setDefaultDateState(null);
            // State
            calendar.setState(null);
        }


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

    let clampedDate = clampDate(
        inputFieldEl.value,
        inputFieldEl.dataset.minDate,
        inputFieldEl.dataset.maxDate
    );

    if (formatDate.ymd(clampedDate) != inputFieldEl.value) {
        setDate(inputFieldEl, clampedDate);
    }
}

function setDate(inputFieldEl, date) {
    inputFieldEl.value = formatDate.ymd(date);
    dispatchEvent(inputFieldEl, 'change')
}
function setPlaceholder(inputFieldEl, date) {
    InputValuePreview.setPlaceholder(
        inputFieldEl,
        // Formatēta date value
        date ? formatDate.Mdy(date) : ''
    );
}

export default {
    init() {

        /**
         * TODO FieldData jāpārsauc par DataPicker vai tamlīdzīgi
         * doma tāda, ka date picker var atvērt no jebkura elementa, kura uzlikts menu="field-date-calendar"
         *   - datuma lauks
         *   - Week calendar datuma poga, kur atver datepicker, lai dabūtu datumu
         */
        DropdownMenu.onOpen('field-date-calendar', (menuEl, triggerEl) => {
            setupCalendar(triggerEl)
            activeField = triggerEl;
            activeMenu = menuEl;
        })

        DropdownMenu.onClose('field-date-calendar', (menuEl, triggerEl) => {
            activeField = null;
            activeMenu = null;
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

            setPlaceholder(fieldDateEl, inputEl.value ? stringToDate(inputEl.value) : null)
        })
    },

    /**
     * TODO Varbūt vajag klausīties uz input lauka change
     * tad varētu tikai norītī lauku un pārējais viss tiktu izdarīts eventā
     */
    clear(fieldDateEl) {
        let inputEl = q(fieldDateEl, 'input');
        inputEl.value = '';
        setPlaceholder(fieldDateEl, null);
    },

    /**
     * Update field display value
     */
    update(fieldDateElOrinputEl) {

        let fieldDateEl = parent(fieldDateElOrinputEl, '.field-date');
        let inputEl = q(fieldDateEl, 'input');

        setPlaceholder(
            fieldDateEl,
            inputEl.value ? stringToDate(inputEl.value) : null
        )
    },

    /**
     * Kāds modulis uzliek savu listener pēc name
     * kad htmlā taisa elementu uz kur atvērt DatePicker, tad tur
     * tiks pārbaudīts vai ir uzlikts listener name
     * Kad tiks izvēlēts datums, tad tiks izsaukts tas listener, kurš atbilst šim name
     *
     * htmlā tad varēs norādīts listenername un JS pusē jau pielikt reālo funkciju
     */
    setNamedListener(listenerName, cb) {
        namedListeners[listenerName] = cb;
    }
}