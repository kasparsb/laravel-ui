<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class DropdownMenu extends Component
{
    public function __construct(
        // Menu name, pēc kura varēs noteikt, kādu menu rādit spiežo uz pogas
        public $name='',


        /**
         * Element at which position dropdown menu
         *
         * šo varēs override openTrigger elements
         * ja uz triggerEl ir uzlikts data-dropdown-menu-position-at, tad
         * positionEl būs open trigger. Var norādīt query selector, kurš būs
         * relatīvs pret triggerEl
         */
        public $positionAt = '',

        // Custom cooridinates
        public $x = null,
        public $y = null,

        /**
         * pret kuru malu novietot (attiecībā pret positionAt)
         * top, left, bottom, right
         */
        public $side = 'bottom',

        /**
         * kā nopzicionēt pret malu
         * bottom | top:
         *     left, right, center
         * left | right:
         *     top, bottom, center
         */
        public $align = 'left',


        public $hidden = true,
        public $tabIndex = -1,

        /**
         * Child menu itema name, kurš būs selected
         */
        public $item = null, // null nozīmē, ka neviens nebūs selected
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.dropdown-menu');
    }
}
