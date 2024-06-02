<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Http\Request;

class Checkbox extends Component
{
    public function __construct(
        public $label='',
        public $name='',
        public $checked='',
        public $model=null,

        public $errorMessage='',
        public $hasError=false,
        // Laravel errors
        public ?ViewErrorBag $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        public ?Request $request=null,
    )
    {
        if ($this->model) {
            $this->checked = $this->model->{$this->name} ? true : false;
        }

        if ($this->request) {
            if (!is_null($oldValue = $this->request->old($this->name))) {
                $this->checked = $oldValue ? true : false;
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
        return view('ui::components.checkbox');
    }
}
