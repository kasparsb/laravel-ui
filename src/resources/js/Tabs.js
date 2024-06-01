import {q, qa, parent, click} from 'dom-helpers';

function enableTabContent(tabContentEl) {
    if (!tabContentEl) {
        return
    }
    tabContentEl.dataset.selected = '';
    setInputsDisabled(tabContentEl, false);
}

function disableTabContent(tabContentEl) {
    if (!tabContentEl) {
        return
    }
    delete tabContentEl.dataset.selected
    setInputsDisabled(tabContentEl, true);
}

function setInputsDisabled(tabContentEl, isDisabled) {
    if ('disableInputs' in tabContentEl.dataset) {
        qa(tabContentEl, 'input').forEach(inputEl => {
            if (isDisabled) {
                inputEl.disabled = true
            }
            else {
                // Liekam initial disabled state
                inputEl.disabled = inputEl.dataset.initialDisabledState == 'disabled'
            }
        })
    }
}

let Tabs = {
    init() {
        click('.tabs .tab', (ev, selectedTabEl) => {
            let tabsEl = parent(selectedTabEl, '.tabs');

            // Hide currenlty selected tab
            let currentlySelectedTabEl = q(tabsEl, '[data-selected]');
            if (currentlySelectedTabEl) {
                delete currentlySelectedTabEl.dataset.selected;
            }

            selectedTabEl.dataset.selected = '';
            tabsEl.dataset.selected = selectedTabEl.dataset.tabName;


            // Meklējam visus tab-content
            qa(tabsEl, '[data-role=tab]').forEach(tabEl => {
                let tabContentEl = q(`[data-role=tab-content][data-tab-name="${tabEl.dataset.tabName}"]`);
                if (tabEl.dataset.tabName == selectedTabEl.dataset.tabName) {
                    enableTabContent(tabContentEl)
                }
                else {
                    disableTabContent(tabContentEl)
                }
            });

        })


        // Uzliekam input laukiem initial disabled state
        qa('[data-role=tab-content][data-disable-inputs]').forEach(tabContentEl => {
            qa(tabContentEl, 'input').forEach(inputEl => {
                inputEl.dataset.initialDisabledState = inputEl.disabled ? 'disabled' : 'enabled';
            })
        });

        // Disable inactive tabs
        qa('[data-role=tab-content][data-disable-inputs]').forEach(tabContentEl => {
            if ('selected' in tabContentEl.dataset) {
                enableTabContent(tabContentEl);
            }
            else {
                disableTabContent(tabContentEl);
            }
        })
    }
}

export default Tabs;