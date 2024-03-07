<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Checkbox extends Component
{
    public function __construct(
        public $label='',
        public $name='',
        public $checked='',
        public $model=null,
    )
    {
        if ($this->model) {
            $this->checked = $this->model->{$this->name} ? true : false;
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.checkbox');
    }
}
