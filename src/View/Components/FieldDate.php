<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FieldDate extends Component
{
    public function __construct(
        public $label='',
        public $name='',
        public $value='',
        public $description='',
        public $placeholder='',
        public $model=null,
    )
    {
        if ($this->model) {
            $this->value = $this->model->{$this->name};
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-date');
    }
}
