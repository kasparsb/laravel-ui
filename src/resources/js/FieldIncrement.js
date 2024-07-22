import {q, clickp, on, parent, dispatchEvent} from 'dom-helpers';

function sp(s, padString='0', padLength=2) {

    s = s+'';
    while (s.length < padLength) {
        s = padString+s;
    }
    return s;
}

function toInt(value) {
    let num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

function timeToInt(timeString) {
    let p = timeString.split(':');
    if (p.length > 1) {
        return (parseInt(p[0], 10) * 60) + parseInt(p[1], 10)
    }
    return parseInt(timeString, 10);
}

function toTimeString(value) {
    let hours = Math.floor(value/60);
    let minutes = value - (hours * 60);

    return sp(hours)+':'+sp(minutes);
}

function inc(fieldEl) {
    let c = getConfig(fieldEl);
    setValue(fieldEl, getValue(fieldEl) + c.step)
}

function dec(fieldEl) {
    let c = getConfig(fieldEl);
    setValue(fieldEl, getValue(fieldEl) - c.step)
}

function setValue(fieldEl, value) {

    let c = getConfig(fieldEl);

    // Validējam
    if (c.isMin && value < c.min) {
        value = c.min;
    }

    if (c.isMax && value > c.max) {
        value = c.max;
    }

    if (c.format == 'time') {
        q(fieldEl, 'input').value = toTimeString(value);
    }
    else {
        if (c.padLeft) {
            value = sp(value, c.padLeft, c.padLeftLength)
        }
        q(fieldEl, 'input').value = value;
    }

    dispatchEvent(q(fieldEl, 'input'), 'change');
}

function getValue(fieldEl) {
    let c = getConfig(fieldEl);

    if (c.format == 'time') {
        return timeToInt(q(fieldEl, 'input').value);
    }
    else {
        return toInt(q(fieldEl, 'input').value);
    }
}

function getConfig(fieldEl) {
    let r = {
        format: fieldEl.dataset.format,
        isMin: 'min' in fieldEl.dataset,
        isMax: 'max' in fieldEl.dataset,
        min: '',
        max: '',
        step: parseInt(fieldEl.dataset.step, 10),
        padLeft: 'padLeft' in fieldEl.dataset ? fieldEl.dataset.padLeft : false,
        padLeftLength: 'padLeftLength' in fieldEl.dataset ? fieldEl.dataset.padLeftLength : false,
    }

    if (r.isMin) {
        if (r.format == 'time') {
            r.min = timeToInt(fieldEl.dataset.min)
        }
        else {
            r.min = parseInt(fieldEl.dataset.min, 10)
        }
    }

    if (r.isMax) {
        if (r.format == 'time') {
            r.max = timeToInt(fieldEl.dataset.max)
        }
        else {
            r.max = parseInt(fieldEl.dataset.max, 10)
        }
    }

    return r;
}

export default {
    init() {
        let it = 0;
        clickp('.field-increment [data-r="inc"]', (ev, el) => {
            clearInterval(it);
            inc(parent(el, '[data-is-container]'))
        })
        clickp('.field-increment [data-r="dec"]', (ev, el) => {
            clearInterval(it);
            dec(parent(el, '[data-is-container]'))
        })

        on('mousedown', '.field-increment [data-r="inc"]', (ev, el) => {
            let fieldEl = parent(el, '[data-is-container]');
            it = setTimeout(() => {
                it = setInterval(() => {
                    inc(fieldEl)
                }, 100)
            }, 450)
        })

        on('mousedown', '.field-increment [data-r="dec"]', (ev, el) => {
            let fieldEl = parent(el, '[data-is-container]');
            it = setTimeout(() => {
                it = setInterval(() => {
                    dec(fieldEl)
                }, 100)
            }, 450)
        })

        on('keydown', '.field-increment', (ev, el) => {
            // Prevent, lai kursors nelēkā
            switch (ev.key) {
                case 'ArrowUp':
                    ev.preventDefault();
                    inc(parent(el, '[data-is-container]'))
                    break;
                case 'ArrowDown':
                    ev.preventDefault();
                    dec(parent(el, '[data-is-container]'))
                    break;
            }
        })
    }
}