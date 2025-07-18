<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;


class Fieldable extends Component
{
    public function __construct(
        public $label=false
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.fieldable');
    }
}
