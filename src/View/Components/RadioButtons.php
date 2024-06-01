<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class RadioButtons extends Component
{
    public function __construct(
        public $name,
        public $label='',
        public $description='',
        public $value='',
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.radio-buttons');
    }
}
