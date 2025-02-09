import DropdownMenu from '../DropdownMenu';

/**
 * Pārbauda vai uz el ir data-menu-hide atribūts
 * salīdzina ar padoto event, ja data-menu-hide sakrīt ar event
 * tad aizvert to DropdownMenu, kurā atrodas el
 *
 * šo izmanto Form, ButtonPost, ButtonGet, ButtonDelete
 * lai varētu aizvērt DropdownMenu, pirms vai pēc request veikšanas
 */
function handleDropdownMenuHideFromEl(el, eventName) {
    if (!('dropdownMenuHide' in el.dataset)) {
        return;
    }

    if (el.dataset.dropdownMenuHide == eventName) {
        let menuEl = DropdownMenu.getByChild(el);
        if (menuEl) {
            DropdownMenu.close(menuEl);
        }
    }
}

export default handleDropdownMenuHideFromEl;