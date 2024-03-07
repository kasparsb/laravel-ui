<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ToggleSwitch extends Component
{
    public function __construct(
        public $name='',
        public $label='',
        public $labelPosition='right',
        public $checked=false,
        public $description='',
        public $model=null,
    )
    {
        if ($this->model) {
            $this->checked = $this->model->{$this->name} ? true : false;
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.toggle-switch');
    }
}
