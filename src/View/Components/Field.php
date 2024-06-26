<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Field extends Component
{
    public function __construct(
        public $type='text',
        public $label='',
        public $name='',
        public $value='',
        public $description='',
        public $placeholder='',
        public $model=null,
        public $disabled=false,
    )
    {
        if ($this->model) {
            $this->value = $this->model->{$this->name};
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field');
    }
}
