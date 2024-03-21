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
        // Ja static, tad ir redzama, tur kur izvadīta. Nedarbojas kā uzpeldošā menu
        public $isStatic=false,
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.dropdown-menu');
    }
}
