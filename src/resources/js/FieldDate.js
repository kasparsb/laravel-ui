import {jsx, q, qa, parent, addStyle, append, replaceContent, getOffset, isChild, on} from 'dom-helpers';
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

function triggerEvent(el, eventName) {
    var event = new Event(eventName, { bubbles: true });
    // Dispatch it.
    el.dispatchEvent(event);
    return;
}

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar() {
    if (!container) {
        container = (
            <div class="overlay-container">

                <div class="card is-overlay compact b-c-200">
                    <div class="card-content">
                        <div class="calendar size-8" data-calendarcontainer="yes"></div>
                    </div>
                </div>

            </div>
        )

        append('body', container);
    }

    if (!calendar) {
        calendar = createCalendar(new Date());
        /**
         * Tieši, kad lietotājs izvēlējies datumu
         * tāpēc te nav change, bet ir dateclick
         */
        calendar.on('dateclick', dateSelected)

        replaceContent(q(container, '[data-calendarcontainer]'), calendar.getEl());
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

    /**
     * @todo šo vēl vajag kārtīgi pārbaudīt
     * tieši event trigerošanu, lai nostrādā visi
     * citi change eventi
     */
    triggerEvent(activeField, 'change')


    close()
}

function close() {
    activeField = null;

    container.dataset.visible = '';

    isOpen = false;
}

function open(field) {
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


        // Show
        container.dataset.visible = 'yes';
        isOpen = true;
    }, 10)

    // Pozicionē container pret input lauku
    let p = getOffset(field)
    addStyle(container, {
        top: (p.top+40)+'px',
        left: p.left+'px',
    })
}

function validateFieldValue(inputFieldEl) {
    // ja nav vērtības ko validēt, tad bail
    if (!inputFieldEl.value) {
        return
    }

    let clampedValue = formatDate.ymd(clampDate(inputFieldEl.value, inputFieldEl.dataset.minDate, inputFieldEl.dataset.maxDate));
    if (clampedValue != inputFieldEl.value) {
        inputFieldEl.value = clampedValue;

        triggerEvent(inputFieldEl, 'change')
    }
}

let closeTimeout = 0;
let wasMouseDown = false;
let wasSetDateInInputFromCalendar = false;

export default {
    init() {


        /**
         * TODO Šitā visa mega loģika, lai kalendārs atvērtos gan uz click gan uz focus
         * TODO kā arī lai aizvērtos uz focusout, esc, out of element click
         * TODO bet lai nevērtos ciet, ja pašā kalendārā sāk klikšķināt
         */

        on('click', 'html', (ev, el) => {
            // Ja ir .field-data input, tad skip
            if (parent(ev.target, '.field-date')) {
                clearTimeout(closeTimeout);
            }
            else {
                if (isChild(ev.target, container)) {
                    clearTimeout(closeTimeout);
                }
                // Ja el nav date pickerī, tad aizveram kalendāru
                else {
                    if (isOpen) {
                        closeTimeout = setTimeout(() => close(), 50);
                    }
                }
            }
        })

        on('mousedown', ev => {
            if (isChild(ev.target, container)) {
                wasMouseDown = true;
            }
        })

        // close on esc
        on('keydown', '.field-date input', (ev, el) => {
            // esc
            if (ev.keyCode == 27) {
                if (isOpen) {
                    closeTimeout = setTimeout(() => close(), 50);
                }
            }
            // tab
            else if (ev.keyCode == 9) {
            }
            else {
                if (!isOpen) {
                    open(el)
                }
            }
        })

        on('focusout', '.field-date input', (ev) => {
            if (isOpen) {
                if (!wasMouseDown) {
                    if (!isChild(ev.target, container)) {
                        closeTimeout = setTimeout(() => close(), 50);
                    }
                }
            }
            wasMouseDown = false;
        })

        on('click', '.field-date input', (ev, el) => {
            clearTimeout(closeTimeout);
            open(el)
        })

        on('focusin', '.field-date input', (ev, el) => {
            if (!wasSetDateInInputFromCalendar) {
                clearTimeout(closeTimeout);
                open(el)
            }
            wasSetDateInInputFromCalendar = false;
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