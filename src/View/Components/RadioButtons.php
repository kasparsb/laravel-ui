<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class RadioButtons extends Component
{
    public function __construct(
        public $name,
        public $value='',

        /**
         * Default vērtības skatīties RadioButton komponentē
         */
        public $buttonClass=null,
        public $buttonClassSelected=null,

        /**
         * Parent komponente nodod savus data attributs,
         * jo blade komponentēm var padot tikai parametrus
         * {{ $dataAttributs }} šādi met error
         */
        public $dataAttributes=null,
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.radio-buttons');
    }
}
