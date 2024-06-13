import {
    q, qa, append, parent, on, getFormData, post, clone,
    clearFormData
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
}

export default {
    init() {

        on('focusout', 'input', (ev, el) => {
            let tr = parent(el, 'tr');
            if (tr) {
                let data = getFormData(parent(el, 'tr'));
                let link = '';
                if (data.id) {
                    link = parent(el, '.table').dataset.linkUpdate;

                    /**
                     * TODO vajag kaut kā dabūt link, lai te nekas nav jārepleico
                     */
                    link = link.replace('#id#', data.id);
                }
                else {
                    link = parent(el, '.table').dataset.linkCreate;
                }

                post(link, data)
                    .then(r => console.log(r));
            }
        })

    },

    /**
     * Add new row to table
     */
    addRow(tableEl) {
        addRow(tableEl);
    }
}