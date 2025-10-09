import {on, parent} from 'dom-helpers';

export default {
    init() {
        on('change', '.toggle-switch [type="checkbox"]', (ev, inputEl) => {
            let toggleSwitchEl = parent(inputEl, '.toggle-switch');

            // Izpildām data-on-change event
            if (toggleSwitchEl.dataset.onChange) {
                if (toggleSwitchEl.dataset.onChange == 'submit') {
                    Form.submit(
                        Form.findParentForm(toggleSwitchEl)
                    )
                }
                else if (toggleSwitchEl.dataset.onChange.startsWith('submit:')) {
                    Form.submit(
                        qr(toggleSwitchEl, toggleSwitchEl.dataset.onChange.slice(7))
                    )
                }
            }
        })
    }
}