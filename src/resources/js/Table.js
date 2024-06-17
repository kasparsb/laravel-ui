import {
    q, r, qa, append, remove, parent, on, getFormData, post, clone,
    clearFormData, change, ce
} from 'dom-helpers';

function addRow(tableEl) {

    // Klonējam pēdējo row
    let lastTrEl = q(tableEl, 'tbody tr:last-child');

    // Ja tabulā nav datu, tad nebūs nevienas īstās row ko klonēt
    // tāpēc tukšā tabulā vienmēr būs hidden tukša rinda, to tad šajā
    // mirklī padaram redzamu
    if ('tableBlankRow' in lastTrEl.dataset) {
        lastTrEl.hidden = false;
        delete lastTrEl.dataset.tableBlankRow;
        return lastTrEl;
    }

    let newRow = clone(lastTrEl);

    // clean up values in input fields
    clearFormData(newRow);

    /**
     * Clear select field placeholders
     * TODO kaut kā vajag, lai automātiski notīrās
     */
    qa(newRow, '.select-placeholder span').forEach(selectPlaceholderEl => selectPlaceholderEl.innerHTML = '');

    newRow = append(q(tableEl, 'tbody'), newRow);

    setRowInputFieldsNames(tableEl, newRow);

    syncCheckAllRowsCheckbox(tableEl)

    return newRow;
}

/**
 * Rindas input elementiem uzstāda atbilstošo name, lai tiktu
 * ņemts vērā tabla name un sectionRowIndex
 *
 * šāda struktūra name
 * tablename[sectionRowIndex][columnname]
 *
 * doma tāda, lai postējot servera pusē var nolasīt lauku pēc
 * table name un serera pusē būtu masīvs ar visām tabulas rindām
 */
function setRowInputFieldsNames(tableEl, trEl) {
    // sectionRowIndex jo tas ir relatīvs pret tbody
    let rowIndex = trEl.sectionRowIndex;

    qa(trEl, 'td').forEach(tdEl => {
        let inputEl = q(tdEl, 'input, select, textarea');
        if (inputEl) {
            inputEl.name = tableEl.dataset.name + '['+rowIndex+']['+tdEl.dataset.name+']';
        }
    })
}

function deleteRow(trEl) {
    let tableEl = parent(trEl, '.table');

    remove(trEl);

    // dzēšot row vajag visām rindā atjaunot input names, lai ir secīgi pēc ar rindu index
    qa('tbody tr').forEach(trEl => setRowInputFieldsNames(tableEl, trEl));
}

function setRowsChecked(tableEl, checked) {
    qa(tableEl, '[data-r="tableRowCheck"] input').forEach(checkboxEl => {
        checkboxEl.checked = checked
    });
}

function syncCheckAllRowsCheckbox(tableEl) {
    let checkAllRowsCheckbox = q(tableEl, 'thead [data-r="tableRowCheck"] input');
    if (!checkAllRowsCheckbox) {
        return;
    }

    let allChecked = false;
    let rowCheckboxes = qa(tableEl, 'tbody [data-r="tableRowCheck"] input');
    if (rowCheckboxes.length > 0) {
        allChecked = true;
        for (let i = 0; i < rowCheckboxes.length; i++) {
            if (!rowCheckboxes[i].checked) {
                allChecked = false
                break;
            }
        }
    }

    checkAllRowsCheckbox.checked = allChecked;
}

function focusFirstInput(trEl) {
    let inputEls = qa(trEl, 'input, select, button');

    for (let i = 0; i < inputEls.length; i++) {
        if (inputEls[i].hidden) {
            continue;
        }
        if (inputEls[i].type == 'hidden') {
            continue;
        }
        // Skip row select checkbox
        if (parent(inputEls[i], '[data-r="tableRowCheck"]', 'td')) {
            continue;
        }

        // focus first input
        inputEls[i].focus()

        return;
    }
}

function createLastFocusinEl() {
    return ce('div', {
        data: {
            r: 'lastfocusouttrapdiv'
        },
        style: {
            width: '0px',
            height: '0px',
            overflow: 'hidden'
        }
    }, [
        ce('input', {
            data: {
                r: 'lastfocusouttrap'
            }
        })
    ])
}

function addLastFocusinTrap(tableEl) {
    append(tableEl, createLastFocusinEl());

}

export default {
    init() {

        /**
         * If last input element is being focused out, then add new row
         * and focus first input element in row
         *
         * * focusout eventā ir par vēlu likt jauno rindu un meģināt to fokusēt,
         * * jo ja table rindā tas ir pēdējais elements lapā, tad uz focusout
         * * fokuss aiziet kaut kur ārpus lapas un pēc tam vairs nevar dabūt
         * * fokusu atpakaļ uz jaunizveidoto rindu
         * * jauno rindu vajag ielikt laicīgi un noslēpt
         *
         * * taisam focusin trap input lauku, kurš kaut kā jāpadara neredzams un tam
         * * ir jābūt pašam pēdējām tabulā
         * * tikko, tas dabūt focusin, tā taisam jaunu rindu un foksuēja pirmo input
         *
         */
        on('focusin', '.table [data-r="lastfocusouttrap"]', (ev, el) => {
            focusFirstInput(addRow(parent(el, '.table')));
        })

        // Checkbox check/uncheck all table rows
        change('.table thead [data-r="tableRowCheck"] input', (ev, el) => {
            let tableEl = parent(el, 'table');
            if (tableEl) {
                setRowsChecked(tableEl, el.checked)
            }
        })

        change('.table tbody [data-r="tableRowCheck"] input', (ev, el) => {
            let tableEl = parent(el, '.table');
            if (tableEl) {
                syncCheckAllRowsCheckbox(tableEl);
            }
        })



        qa('.table').forEach(tableEl => addLastFocusinTrap(tableEl));
    },

    /**
     * Add new row to table
     */
    addRow(tableNameOrEl) {
        if (typeof tableNameOrEl == 'string') {
            tableNameOrEl = q(`.table[data-name="${tableNameOrEl}"]`)
        }
        addRow(tableNameOrEl);
    },

    deleteRow(trEl) {
        deleteRow(trEl);
    },

    setRowsChecked(tableEl, checked) {
        setRowsChecked(tableEl, checked)
    }
}