import {jsx, q, qa, append, get} from 'dom-helpers';
import BaseCalendar from 'calendar';

function stringToDate(dateString) {

    // Sadalam pa datumu un laiku
    var dp = dateString.split(' ');

    // gads, mēnesis, diena
    var date = dp[0].split('-');
    // stundas, minūtes, sekundes
    var time = [0, 0, 0];
    if (dp.length > 1) {
        time = dp[1].split(':');
    }

    if ((date.length != 3) || (time.length != 3)) {
        return new Date();
    }

    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
}

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

function cloneDate(date) {
    return new Date(date.getTime());
}

function daysInMonthByDate(date) {
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}

function findMinMaxDates(dates) {
    let min, max;

    dates.forEach(date => {
        date = cloneDate(date);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setMilliseconds(0);

        if (!min) {
            min = cloneDate(date);
        }
        else if (min.getTime() > date.getTime()) {
            min = cloneDate(date);
        }

        date.setDate(daysInMonthByDate(date));

        if (!max) {
            max = cloneDate(date);
        }
        else if (max.getTime() < date.getTime()) {
            max = cloneDate(date);
        }
    })

    return {min, max};
}

function Calendar(containerEl) {

    this.containerEl = containerEl;

    // Vai ir period select
    this.isPeriod = containerEl.dataset.period == 'yes';

    /**
     * Šie lauki ir vienmēr. By default bez name. Ja padots name, tad ar name
     */
    // Single date lauks
    this.dateInputField = q(this.containerEl, 'input[data-role="date"]');
    // Period lauki
    this.fromInputField = q(this.containerEl, 'input[data-role="from"]');
    this.tillInputField = q(this.containerEl, 'input[data-role="till"]');

    this.statusUrl = false;
    if (containerEl.dataset.statusUrl) {
        this.statusUrl = containerEl.dataset.statusUrl;
    }

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


    this.calendar = new BaseCalendar.dom(firstDate, {
        //cssprefix: '',
        view: 'month',
        count: 1,
        showWeekdays: true,
        showDateSwitch: true,
        showToday: false,
        showSelectedDate: true,
        // pazīme, ka jāļauj atzīmēt period
        selectPeriod: this.isPeriod,
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
    });

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


    if (this.statusUrl) {
        this.calendar.on('slideschange', dates => {

            let period = findMinMaxDates(dates);

            get(this.statusUrl, {
                from: ymd(period.min),
                till: ymd(period.max)
            })
                .then(status => {
                    this.calendar.setState(status)
                })
        });
    }

    // Ja ir date input field, tad uz dateclick ieliksim to datumu laukā
    if (this.dateInputField) {
        this.calendar.on('dateclick', date => {
            this.dateInputField.value = ymd(date)
        })
    }

    if (this.fromInputField || this.tillInputField) {
        this.calendar.on('periodselect', period => {
            if (this.fromInputField) {
                this.fromInputField.value = ymd(period.from)
            }
            if (this.tillInputField) {
                this.tillInputField.value = ymd(period.till)
            }
        })
    }

    // Append, jo containerEl var būt iekšā date input field
    append(this.containerEl, this.calendar.getEl());
}


let instances = [];

export default {
    init() {
        [...qa('.calendar')].forEach(calendarEl => {
            let newLength = instances.push({
                name: calendarEl.dataset.name,
                calendar: new Calendar(calendarEl)
            });
            calendarEl.dataset.calid = newLength - 1;
        })

        // Register method to get calendar instance by name
        window.uiGetCalendarByName = function(name){
            let instance = instances.find(instance => instance.name == name);
            return instance ? instance.calendar.calendar : null;
        }
    }
};