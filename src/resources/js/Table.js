import {
    q, qa, append, remove, parent, on, getFormData, post, clone,
    clearFormData, change
} from 'dom-helpers';

function addRow(tableEl) {
    // Klonējam pēdējo row
    let newRow = clone(q(tableEl, 'tbody tr:last-child'));

    // clean up values in input fields
    clearFormData(newRow);

    /**
     * Clear select field placeholders
     * TODO kaut kā vajag, lai automātiski notīrās
     */
    qa(newRow, '.select-placeholder span').forEach(selectPlaceholderEl => selectPlaceholderEl.innerHTML = '');

    newRow = append(q(tableEl, 'tbody'), newRow);

    // focus first field
    let firstInputField = q(newRow, 'input, select');
    if (firstInputField) {
        firstInputField.focus()
    }

    syncCheckAllRowsCheckbox(tableEl)
}

function deleteRow(trEl) {
    remove(trEl);
}

function setRowsChecked(tableEl, checked) {
    qa(tableEl, '[data-table-checkrow] input').forEach(checkboxEl => {
        checkboxEl.checked = checked
    });
}

function syncCheckAllRowsCheckbox(tableEl) {
    let checkAllRowsCheckbox = q(tableEl, 'thead [data-table-checkallrows] input');
    if (!checkAllRowsCheckbox) {
        return;
    }

    let allChecked = true;
    let rowCheckboxes = qa(tableEl, '[data-table-checkrow] input');
    for (let i = 0; i < rowCheckboxes.length; i++) {
        if (!rowCheckboxes[i].checked) {
            allChecked = false
            break;
        }
    }

    checkAllRowsCheckbox.checked = allChecked;
}

function updateRowData(trEl) {
    let tableEl = parent(trEl, '.table');

    let data = getFormData(trEl);
    let link = '';
    if (data.id) {
        link = tableEl.dataset.linkUpdate;

        /**
         * TODO vajag kaut kā dabūt link, lai te nekas nav jārepleico
         */
        if (link) {
            link = link.replace('#id#', data.id);
        }
    }
    else {
        link = tableEl.dataset.linkCreate;
    }

    if (link) {
        post(link, data)
            .then(r => console.log(r));
    }
}

export default {
    init() {

        on('focusout', 'input, select', (ev, el) => {
            let trEl = parent(el, 'tr');
            if (trEl) {
                updateRowData(trEl)
            }
        })

        // Checkbox check/uncheck all table rows
        change('.table thead [data-table-checkallrows] input', (ev, el) => {
            let tableEl = parent(el, 'table');
            if (tableEl) {
                setRowsChecked(tableEl, el.checked)
            }
        })

        change('.table tbody [data-table-checkrow] input', (ev, el) => {
            let tableEl = parent(el, 'table');
            if (tableEl) {
                syncCheckAllRowsCheckbox(tableEl);
            }
        })
    },

    /**
     * Add new row to table
     */
    addRow(tableEl) {
        addRow(tableEl);
    },

    deleteRow(trEl) {
        deleteRow(trEl);
    },

    setRowsChecked(tableEl, checked) {
        setRowsChecked(tableEl, checked)
    }
}