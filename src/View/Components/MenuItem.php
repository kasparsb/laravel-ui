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
        public $replaceHtml=false,
        // Ja atrodas iekš menuEl, bet vajag replaceHtml uz pogas, kas atvēra menu
        // tagad darbojas tikai šis: dropdownMenuOpenTrigger
        public $replaceHtmlTarget=false,

        public $menu = '',
        public $menuShow = '',
        public $menuFocus=true, // ko iefokusēt, kad menu atveras. Default pats menu | firstFocusable | querySelector
        public $menuHide = null, // null nozīmē, ka nav uzsetots. Var padot arī empty string vai boolean
        public $menuResetForm = false,

        /**
         * Custom position coordinates
         * *Skatīties DropdownMenu aprakstu par to kā veidojas koordinātes
         */
        public $menuPositionX = false,
        public $menuPositionY = false,
        public $menuPositionDir = null,
        public $menuPositionXOffset = false,
        public $menuPositionYOffset = false,
        // Elements pret kuru pozicionēt ir pati poga
        public $menuPositionAt = '',
        // Dir tiek ņemts no Dropdown defaults
        public $menuPositionAtDir = 'left bottom',

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
                /**
                 * selected no parent liekam, tikai, ja tas nav null
                 * tukšs string der kā derīga vērtība
                 */
                $selectedItem = view()->getConsumableComponentData('item');
                if (!is_null($selectedItem)) {
                    $this->selected = $this->name == $selectedItem;
                }
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.menu-item');
    }
}
