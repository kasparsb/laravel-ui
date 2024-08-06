<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class FieldIncrement extends Component
{
    use ComponentWithError;
    use ComponentWithRequestOldValue;

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

        public $errorMessage='',
        public $hasError=false,
        // Laravel errors, nevar likt tipu, jo tad tas tiks izvilkts no container un būs tukšs
        public $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        public ?Request $request=null,

        public $menu = '',
        public $menuShow = '',
        public $menuHide = null, // null nozīmē, ka nav uzsetots. Var padot arī empty string vai boolean
        public $menuResetForm = false,
        public $menuPositionAt = null,

        public $min = 0,
        public $max = null,
        public $step = 1,
        public $format = 'number', // number, time
        public $padLeft = null,
        public $padLeftLength = null,
    )
    {
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
        return view('ui::components.field-increment');
    }
}
