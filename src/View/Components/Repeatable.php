<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Repeatable extends Component
{
    public function __construct(
        public $newItemLink,
        public $isEmpty=false,

        /**
         * Id input laiku vārds vai query selector.
         * Droši vien, ka izmantos tieši querySelector, jo name būs ar indeksu kopā,
         * piemēram, products[2][id]
         * tāpēc, ja izmanto querySelector, tad visiem laukiem var uzlikt data-id-field
         * Šajā laukā būs Id vērtība, tad repeatableEl
         * netiks dzēst, bet tam uzliks pazīmi, ka ir dzēsts un pielikts
         * trackDelted input lauku
         */
        public $idFieldSelector='',
        /**
         * Ja ir norādīts šis selector, tad tiks kontrolēta lauku dzēšana
         *
         * Repeatable pats neviedos lauku deleted
         * šis ir selector, lai repeatable var atrast lauku, kurā
         * ielikt vērtību, ka šis item ir dzēsts
         *
         * Pats repeatable neveidos laukus, jo tad vajag zināt kā veidot
         * field name, vajag zināts kāds ir indekss utt. Tas viss rada
         * papildus sarežģītību un iespējams, ka izveidos arī ierobežojumus
         */
        public $deletedFieldSelector='',
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.repeatable');
    }
}
