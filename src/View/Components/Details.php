<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Details extends Component
{
    public function __construct(
        // Key value array
        public $details=null
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.details');
    }
}
