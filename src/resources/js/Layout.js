import {clickp, parent} from 'dom-helpers'

export default {
    init() {
        clickp('.layout [data-expand-menu]', (ev, el) => {
            parent(el, '.layout').dataset.sidebarExpanded = ''
        })
        clickp('.layout [data-contract-menu]', (ev, el) => {
            delete parent(el, '.layout').dataset.sidebarExpanded
        })
    }
}