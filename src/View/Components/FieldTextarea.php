<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FieldTextarea extends Component
{
    public function __construct(
        public $label='',
        public $name='',
        public $value='',
        public $description='',
        public $placeholder='',
        public $model=null,
        public $disabled=false,
        public $error='',
        public $hasError=false,
        public $errors=false,
    )
    {
        if ($this->model) {
            $this->value = $this->model->{$this->name};
        }

        if ($this->errors) {
            if ($this->errors->has($this->name)) {
                $this->error = $this->errors->first($this->name);
                $this->hasError = true;
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-textarea');
    }
}
