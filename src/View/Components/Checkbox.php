<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class Checkbox extends Component
{
    use ComponentWithError;
    use ComponentWithRequestOldValue;

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
        if (!$this->setOldValueCheckbox()) {
            if ($this->model) {
                $this->checked = $this->model->{$this->name} ? true : false;
            }
        }

        $this->setError();
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.checkbox');
    }
}
