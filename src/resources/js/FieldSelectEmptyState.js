import {q, parent, dispatchEvent, get} from 'dom-helpers';
import DropdownMenu from './DropdownMenu';
import Form from './Form';

function isChildOfFieldSelectEmptyState(el) {
    if (parent(el, '[data-field-select-empty-state]')) {
        return true;
    }

    return false;
}

/**
 * Taisto click uz form [type=submit] pogas, kad
 * notiek submit pazūd fokuss. Šajā mirklī aizvērsies
 * DropdownMenu, kurā ir forma. Tāpēc, ja forma ir
 * FieldSelect Dropdown menu, tad lieka, lai ignore focousOut
 */
function handleBeforeSubmit(formEl, response) {
    if (!isChildOfFieldSelectEmptyState(formEl)) {
        return
    }

    DropdownMenu.ignoreFocusoutOnce(DropdownMenu.getByChild(formEl))
}

/**
 * Kad forma ir nosubmitota
 * tad vajag kaut kur iegūt value un valueVisual
 * value būs formā, laukā id (šitas konfigurējams)
 * valueVisual būs jāpieprasa no url
 */
function handleAfterSubmit(formEl, response) {

    if (!isChildOfFieldSelectEmptyState(formEl)) {
        return
    }

    let openTriggerEl = DropdownMenu.getOpenTriggerByChild(formEl);
    let fieldEl = parent(openTriggerEl, '.field-select');

    let valueFieldName = 'id';
    let value;

    /**
     * Šis ir gadījumā, ja ir noticis formEl replace
     * un ir ienākusi jauna form html, kurā ir id lauks
     */
    let valueFieldEl = q(formEl, `[name=${valueFieldName}]`);
    if (valueFieldEl) {
        value = valueFieldEl.value;
    }
    else if (response && typeof response[valueFieldName] != 'undefined') {
        value = response[valueFieldName];
    }

    let inputEl = q(fieldEl, 'input');
    inputEl.value = value;

    // Tāpēc šeit sanāk, ka vajag obligāti šo, dabūtu visualValue html
    // ielādējam valueVisual html
    if (('valueVisualUrl' in fieldEl.dataset) && value) {
        get(fieldEl.dataset.valueVisualUrl, {
            value: value
        })
            .then(valueVisualHtml => {

                /**
                 * TODO šeit visualValue jāliek OptionsList elementā
                 * tad jāpalaiž dispatchEvents un tas pats izvilks visualValue
                 * priekš placeholder elementa
                 *
                 * !!! Sis vēl ir jāuztaisa līdz galam
                 *
                 * šo nevajag šeit palaist InputValuePreview.setPlaceholder
                 * vajag ielikt kā option
                 *
                 * tātad arī visualValueUrl ir jāpārasauc par OptionUrl
                 *
                 * vēl jāsaprot vai man ir paredzēts, ka optionsList elementam
                 * var būt savādāk elements priekš placeholder?
                 */
                // InputValuePreview.setPlaceholder(
                //     fieldEl,
                //     // Formatēta date value
                //     valueVisualHtml
                // );

                // Palaižam change event
                dispatchEvent(inputEl, 'change');


                // Liekam mazu delay, lai var redzēt success message, ja tāds ir
                setTimeout(() => {
                    DropdownMenu.closeByOpenTrigger(openTriggerEl)
                    Form.reset(formEl);
                }, 700)
            })

        return;
    }
    else {
        // Palaižam change event
        dispatchEvent(inputEl, 'change');
    }


    DropdownMenu.closeByOpenTrigger(openTriggerEl)
    Form.reset(formEl);
}

/**
 * Field select Empty state, tas ir kad nav atrasti options
 * tad var rādīt empty state formu, kurā ievadīt jaunu option
 * tur vajag papildus apstrādes uz form submit, lai fieldselect
 * options normāli strādātu
 */
export default {
    init() {
        // Klausāmies uz From submit
        Form.onBeforeSubmit(handleBeforeSubmit)
        Form.onAfterSubmit(handleAfterSubmit)
    }
}