<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class ToggleSwitch extends Component
{

    use ComponentWithError;
    use ComponentWithRequestOldValue;

    public function __construct(
        public $name='',
        // Lauka vārds modelī? Tas ir gadījumā, ja field name atšķiras no model name
        public $nameModel='',
        public $label='',
        public $labelPosition='right',
        public $checked=false,
        public $description='',
        public $model=null,
        public $disabled=false,

        /**
         * submit
         */
        public $onChange=null,

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
                $this->checked = $this->model->{$this->nameModel ? $this->nameModel : $this->name} ? true : false;
            }
        }

        $this->setError();
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.toggle-switch');
    }
}
