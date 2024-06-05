<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class RadioButton extends Component
{
    public $name;

    public function __construct(
        public $selected = null,
        public $value = null,
        public $disabled = false,

        public $buttonClass=null,
        public $buttonClassSelected=null,
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
            if (!is_null($this->value)) {
                $this->selected = $this->value == view()->getConsumableComponentData('value');
            }
        }

        /**
         * buttonClass un buttonClassSelected nolasām šādā secībā
         *     1. pašai pogai uzstadīts
         *     2. skatamies vai RadioButtons komponentei uzstādīts
         *     3. izmantojam default vērtības
         */
        foreach (
            [
                'buttonClass' => 'button-ghost',
                'buttonClassSelected' => 'button-secondary',
            ] as $var => $defaultClassName) {

            if (is_null($this->{$var})) {
                $this->{$var} = view()->getConsumableComponentData($var);
                if (is_null($this->{$var})) {
                    $this->{$var} = $defaultClassName;
                }
            }
        }

        $this->name = view()->getConsumableComponentData('name');
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.radio-button');
    }
}
