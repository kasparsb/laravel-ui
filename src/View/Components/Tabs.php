<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tabs extends Component
{
    public function __construct(
        public $tab = '', // Selected tab
    )
    {


    }

    public function render(): View|Closure|string
    {
        return view('ui::components.tabs');
    }
}
