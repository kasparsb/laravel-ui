<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class NavMenuItem extends Component
{
    public function __construct(
        public $label='',
        public $link='',
        // Name, pēc kura noteikts, vai šis item ir selected
        public $name=null,
        // Pēc noklusējuma nav ne true, ne false
        public $selected=null,
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

            // Ja nav padots name, tad neliekam selected
            // tas ir gadījumam, kad ne NavMenu ne NavMenuItem nav uzlikta aktīvais item
            if (!is_null($this->name)) {
                $this->selected = $this->name == view()->getConsumableComponentData('item');
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.nav-menu-item');
    }
}
