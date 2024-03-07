import {jsx, q, addStyle, append, replaceContent, getOffset, isChild, click} from 'dom-helpers';
import BaseCalendar from 'calendar';

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
        showToday: false,
        // pazīme, ka jāļauj atzīmēt period
        // selectPeriod: true,
        // selectedPeriod: {
        //     from: new Date('2023-05-10 00:00:00'),
        //     till: new Date('2023-05-22 23:59:59')
        // },
        monthDayFormatter: function(date, el, dateState){

            let r = false;
            if (!el) {
                el = <div></div>
                r = true;
            }

            if (dateState) {
                el.className = '';
                if (dateState.className) {
                    el.className = dateState.className;
                }
                el.innerHTML = dateState.html;
            }
            else {
                el.className = 'calendar-single-date';
                el.innerHTML = date.getDate();
            }

            if (r) {
                return el;
            }
        },
        weekDayToText: function(dayIndex) {
            return ['', 'P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'][dayIndex];
        }
    })
}

function triggerEvent(el, eventName) {

    var event = new Event(eventName, { bubbles: true });
    // Dispatch it.
    el.dispatchEvent(event);
    return;

}

function getContainer() {
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
    activeField = field;

    getContainer()

    let p = getOffset(field)
    addStyle(container, {
        top: (p.top+40)+'px',
        left: p.left+'px',
    })

    replaceContent(q(container, '[data-calendarcontainer]'), calendar.getEl());

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