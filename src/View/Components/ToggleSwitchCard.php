<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ToggleSwitchCard extends Component
{
    public function __construct(
        public $name='',
        public $title='',
        public $labelPosition='right',
        public $description='',
        public $checked=false,
        public $model=null,
    )
    {
        if ($this->model) {
            $this->checked = $this->model->{$this->name} ? true : false;
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.toggle-switch-card');
    }
}
