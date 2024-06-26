<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class MenuItem extends Component
{
    public function __construct(
        public $name = '',
        public $link = '',
        public $redirect = '', // redirect link pēc delete
        public $selected = null,
        public $as = '', // link, delete, delete.tableRow, add.tableRow

        public $table = '', // table name, kurai veikt add, delete darbības

        public $linkSource = '', // data-{attribute name} lai varētu link ielasīt no click trigger el
        public $redirectSource = '', // data-{attribute name} lai varētu link ielasīt no click trigger el

        public $disabled = false,
        public $loading = false,
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
        return view('ui::components.menu-item');
    }
}
