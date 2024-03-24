import {parent, on, getFormData, post} from 'dom-helpers';

export default {
    init() {

        on('focusout', 'input', (ev, el) => {
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
        })

    }
}