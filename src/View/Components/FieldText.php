<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class FieldText extends Component
{
    use ComponentWithError;
    use ComponentWithRequestOldValue;

    public function __construct(
        public $label='',
        public $name='',
        public $value='',
        public $description='',
        public $placeholder='',
        public $model=null,
        public $disabled=false,

        public $errorMessage='',
        public $hasError=false,
        // Laravel errors, nevar likt tipu, jo tad tas tiks izvilkts no container un būs tukšs
        public $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        public ?Request $request=null,
    )
    {
        if (!$this->setOldValue()) {
            if ($this->model) {
                $this->value = $this->model->{$this->name};
            }
        }

        $this->setError();
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-text');
    }
}
