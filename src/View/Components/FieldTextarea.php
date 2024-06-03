<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Http\Request;
use Kasparsb\Ui\ComponentWithError;
use Kasparsb\Ui\ComponentWithRequestOldValue;

class FieldTextarea extends Component
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

        // Laravel errors
        public ?ViewErrorBag $errors=null,

        // No šī ņems vērtību, kura tika iepostēta
        // Šis tiks automātiski resolved
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
        return view('ui::components.field-textarea');
    }
}
