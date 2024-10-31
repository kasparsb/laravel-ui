<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tabs extends Component
{
    public function __construct(
        public $name = '',
        public $selected = '', // Selected tab
    )
    {
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.tabs');
    }
}
