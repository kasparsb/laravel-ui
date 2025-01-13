import {r, addStyle} from 'dom-helpers'

function setValue(progressBarEl, progress) {
    progressBarEl = r(progressBarEl);

    addStyle(progressBarEl.indicator, {
        width: progress+'%'
    });
}

export default {
    init() {

    },
    setValue: setValue
}