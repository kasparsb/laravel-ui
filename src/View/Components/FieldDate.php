<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FieldDate extends Component
{
    public function __construct(
        public $label = '',
        public $name = '',
        public $value = '',
        public $defaultValue = '',
        public $description = '',
        public $placeholder = '',
        public $model = null,
        public $stateUrl = '',
        public $minDate='',
        public $maxDate='',
        public $state='',
        public $defaultDateState='',
        public $disabled=false,
        public $error='',
        public $hasError=false,
    )
    {
        if ($this->model) {
            if ($this->model->exists) {
                $this->value = $this->model->{$this->name};
            }
            else {
                // Ja model vēl nav izveidots
                // pārbaudām vai ir value
                if ($this->model->{$this->name}) {
                    $this->value = $this->model->{$this->name};
                }
                // value nav, izmantojam defaultValue
                else {
                    $this->value = $this->defaultValue;
                }
            }
        }
        else {
            /**
             * * default value izmanto tikai model gadījumā
             */
        }

        // Ja value ir Carbon Date objekts
        if ($this->value instanceof Carbon) {
            $this->value = $this->value->format('Y-m-d');
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.field-date');
    }
}
