import {q, qa, parent, click, change} from 'dom-helpers';
import Listeners from './helpers/Listeners';

let onChangeListeners = {};

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
        qa(tabContentEl, 'input, select, textarea').forEach(inputEl => {
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

function changeTab(tabsEl, newTabName) {
    tabsEl.dataset.selected = newTabName;

    let selectedTabEl = null;
    // Meklējam visus tab-content, jo tab var arī nebūt. Tab var parslēgt caur api vai ar field-select
    qa(tabsEl, '[data-role=tab-content]').forEach(tabContentEl => {
        let tabEl = q(tabsEl, `[data-role=tab][data-tab-name="${tabContentEl.dataset.tabName}"]`)

        if (tabContentEl.dataset.tabName == newTabName) {
            enableTabContent(tabContentEl)

            if (tabEl) {
                tabEl.dataset.selected = '';
                selectedTabEl = tabEl;
            }
        }
        else {
            disableTabContent(tabContentEl)
            if (tabEl) {
                delete tabEl.dataset.selected;
            }
        }
    })

    if ('name' in tabsEl.dataset) {
        if (typeof onChangeListeners[tabsEl.dataset.name] != 'undefined') {
            onChangeListeners[tabsEl.dataset.name].trigger([
                tabsEl.dataset.selected,
                selectedTabEl,
                tabsEl
            ]);
        }
    }
}

let Tabs = {
    init() {
        // Tabs switching by any control, which has data-tabs-switch attribute
        change('[data-tabs-switch]', (ev, fieldEl) => {
            if (fieldEl.dataset.tabsSwitch) {
                changeTab(q(`.tabs[data-name=${fieldEl.dataset.tabsSwitch}]`), fieldEl.value)
            }
            else {
                /**
                 * TODO Jāapstrādā gadījums, kad lauks ir tabs elementā
                 */
                return
            }
        })
        // Tabs switching by tabs control
        click('.tabs .tab', (ev, selectedTabEl) => {
            changeTab(parent(selectedTabEl, '.tabs'), selectedTabEl.dataset.tabName);
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
    },

    onChange(tabsName, cb) {
        if (typeof onChangeListeners[tabsName] == 'undefined') {
            onChangeListeners[tabsName] = new Listeners();
        }
        onChangeListeners[tabsName].listen(cb);
    }
}

export default Tabs;