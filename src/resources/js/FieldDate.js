import {jsx, q, addStyle, append, replaceContent, getOffset, isChild, click} from 'dom-helpers';
import BaseCalendar from 'calendar';
import weekDayToText from './calendar/weekDayToText';
import dateCaptionFormatter from './calendar/dateCaptionFormatter';
import navPrevFormatter from './calendar/navPrevFormatter';
import navNextFormatter from './calendar/navNextFormatter';

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
        weekDayToText: weekDayToText,
        dateCaptionFormatter: dateCaptionFormatter,
        navPrevFormatter: navPrevFormatter,
        navNextFormatter: navNextFormatter,
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

                <div class="card is-overlay compact">
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

    // Calendar state url. Ja nav, tad noņem state url
    setTimeout(() => calendar.setStateUrl(field.dataset.stateUrl ? field.dataset.stateUrl : ''), 10)

    // Pozicionē container pret input lauku
    let p = getOffset(field)
    addStyle(container, {
        top: (p.top+40)+'px',
        left: p.left+'px',
    })

    container.dataset.visible = 'yes';

    isOpen = true;
}

export default {
    init() {
        click('html', (ev, el) => {
            if (isOpen) {
                // Ja el nav date pickerī, tad aizveram kalendāru
                if (!isChild(ev.target, container)) {
                    close();
                }
            }

        })

        click('.field-date input', (ev, el) => {
            open(el)
        })
    }
}