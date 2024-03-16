<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tab extends Component
{
    public function __construct(
        public $value='',
        public $selected=null
    )
    {
        if (is_null($this->selected)) {

            /**
             * Componts stack glabājas globālā Illuminate\Contracts\View\Factory objektā
             * tas ir view()
             * view()->getConsumableComponentData($key)
             *     šis vienkārši meklē visās components stackā vērtību pēc padotā key
             * īsti tieši parent nezinu kā iegūt
             *
             * Illuminate\View\Concerns\ManagesComponents::getConsumableComponentData();
             */

            $this->selected = $this->value == view()->getConsumableComponentData('tab');
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.tab');
    }
}
