<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Http\Request;

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

        public $errorMessage='',
        public $hasError=false,
        // Laravel errors
        public ?ViewErrorBag $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        public ?Request $request=null,
    )
    {
        if ($this->model) {
            $this->value = $this->model->{$this->name};
        }

        if ($this->request) {
            if (!is_null($oldValue = $this->request->old($this->name))) {
                $this->value = $oldValue;
            }
        }

        if ($this->errors) {
            if ($this->errors->has($this->name)) {
                $this->errorMessage = $this->errors->first($this->name);
                $this->hasError = true;
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-select');
    }
}
