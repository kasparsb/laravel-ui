<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FieldSelect extends Component
{
    public function __construct(
        public $label='',
        public $name='',
        public $value='',
        public $description='',
        public $options=false,
        // vai rādīt tukšo option elementu
        public $empty=true,
        public $model=null,
        public $disabled=false,
        public $error='',
        public $hasError=false,
    )
    {
        if ($this->model) {
            $this->value = $this->model->{$this->name};
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-select');
    }
}
