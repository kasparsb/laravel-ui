<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tab extends Component
{
    public function __construct(
        public $name = null,
        public $selected = null,
        public $as = '',
        public $link = '',
        public $type = 'button', // Button type
        public $disabled=false,
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
             *
             * Var izmanto šo
             * @aware([
             *     'item' => '',
             * ])
             * bet šis ir pieejams tikai view failā, šeit comopoent klasē tas nav pieejams
             */

            // Ja nav padots name, tad neliekam selected
            // tas ir gadījumam, kad ne Tabs ne Tab nav uzlikta aktīvais tab
            if (!is_null($this->name)) {
                /**
                 * selected no parent liekam, tikai, ja tas nav null
                 * tukšs string der kā derīga vērtība
                 */
                $selectedItem = view()->getConsumableComponentData('selected');
                if (!is_null($selectedItem)) {
                    $this->selected = $this->name == $selectedItem;
                }
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.tab');
    }
}
