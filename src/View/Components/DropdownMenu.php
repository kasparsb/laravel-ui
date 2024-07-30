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
         * pret kuru malu novietot (attiecībā pret click trigger)
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
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.dropdown-menu');
    }
}
