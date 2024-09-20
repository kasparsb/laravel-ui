<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class FieldHoursMinutes extends Component
{
    use ComponentWithError;
    use ComponentWithRequestOldValue;

    public $hours = '';
    public $minutes = '';

    public function __construct(
        public $label='',
        public $labelHours='',
        public $labelMinutes='',
        public $name='',
        // Lauka vārds modelī? Tas ir gadījumā, ja field name atšķiras no model name
        public $nameModel='',
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
                $this->value = $this->model->{$this->nameModel ? $this->nameModel : $this->name};
            }
        }

        $this->setError();

        $this->hours = '';
        $this->minutes = '';

        $p = explode(':', $this->value);
        if (count($p) == 2) {
            $this->hours = $p[0];
            $this->minutes = $p[1];
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-hours-minutes');
    }
}
