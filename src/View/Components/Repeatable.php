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
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.repeatable');
    }
}
