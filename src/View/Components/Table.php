<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Table extends Component
{
    public function __construct(
        public $width='',
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.table');
    }
}
