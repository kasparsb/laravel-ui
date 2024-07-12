<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Option extends Component
{
    public function __construct(
        public $value='',
        public $checked=null,
    )
    {
        if (is_null($this->checked)) {
            $this->checked = $this->value == view()->getConsumableComponentData('value');
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.option');
    }
}
