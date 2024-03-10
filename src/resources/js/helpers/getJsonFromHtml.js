import {q} from 'dom-helpers';

/**
 * ContainerEl elementā ir script tags ar type=application/json
 * tajā ir json encoded dati
 * Script tagam ir data-role atribūte
 * pēc šī atribūta atlasām vajadzīgo script tag un paņemam innerHTML
 * to parse uz objektu
 */
function getJsonFromHtml(containerEl, role) {
    let s = q(containerEl, 'script[data-role="'+role+'"]');
    if (s) {
        try {
            return JSON.parse(s.innerHTML);
        }
        catch(e) {}
    }

    return;
}

export default getJsonFromHtml