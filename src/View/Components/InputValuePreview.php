<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class InputValuePreview extends Component
{
    use ComponentWithError;
    use ComponentWithRequestOldValue;

    public $optionsListId;

    public function __construct(
        public $label='',
        public $name='',
        // Lauka vārds modelī? Tas ir gadījumā, ja field name atšķiras no model name
        public $nameModel='',
        public $value='',
        public $defaultValue = '',
        public $description='',
        public $placeholder='',
        public $model=null,
        public $disabled=false,
        public $tabindex=false,

        public $errorMessage='',
        public $hasError=false,
        // Laravel errors, nevar likt tipu, jo tad tas tiks izvilkts no container un būs tukšs
        public $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        public ?Request $request=null,
    )
    {
        /**
         * * default value izmanto tikai model gadījumā
         */

        if (!$this->setOldValue()) {
            if ($this->model) {
                if ($this->model->exists) {
                    $this->value = $this->model->{$this->nameModel ? $this->nameModel : $this->name};
                }
                else {
                    // Ja model vēl nav izveidots
                    // pārbaudām vai ir value
                    if ($this->model->{$this->nameModel ? $this->nameModel : $this->name}) {
                        $this->value = $this->model->{$this->nameModel ? $this->nameModel : $this->name};
                    }
                    // value nav, izmantojam defaultValue
                    else {
                        $this->value = $this->defaultValue;
                    }
                }
            }
        }

        $this->setError();
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.input-value-preview');
    }
}
