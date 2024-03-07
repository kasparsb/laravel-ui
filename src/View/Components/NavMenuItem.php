<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class NavMenuItem extends Component
{
    public function __construct(
        public $label='',
        public $link='',
        public $selected=false,
    )
    {
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.nav-menu-item');
    }
}
