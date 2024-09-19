<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;

class Button extends Component
{
    public $variant = 'primary';

    public function __construct(
        public $as = '', // link, delete, delete.tableRow, add.tableRow
        public $link = '', // link: priekš href, delete, dinamiskais, ja sākas ar "model:"
        public $redirect = '', // redirect url after delete

        public $menu = '',
        public $menuShow = '',
        public $menuFocus=false, // ko iefokusēt, kad menu atveras. Default pats menu | firstFocusable | querySelector
        /**
         * Tukšs string nozīmē, ka vajag slēpt automātiski
         * onclick.outside
         * onfocusout
         * boolean false nozīmē, ka nevajag automātiski slēpt
         *     explicitly ar menuHide="{menuName}" tiks aizvērts
         */
        public $menuHide = '',
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

        public ?Model $model = null,
        public $disabled = false,
        public $loading = false,
    )
    {
        /**
         * Ja nav uzlikts menuPositionDir: tas ir nav norādīts kur jānovieto Dropdown menu
         * tad novietojumu uzliekam vadoties pēc menuPositionAtDir: tas ir pēc padotā
         * button stūra pret kuru pozicionēt menu
         * uzliekam arī menuPositionYOffset
         */
        if (!$this->menuPositionDir) {
            switch ($this->menuPositionAtDir) {
                case 'left bottom':
                    $this->menuPositionDir = 'right bottom';
                    break;
                case 'right bottom':
                    $this->menuPositionDir = 'left bottom';
                    break;
                case 'left top':
                    $this->menuPositionDir = 'right top';
                    break;
                case 'right top':
                    $this->menuPositionDir = 'left top';
                    break;
            }
        }

        if ($this->menuPositionYOffset === false) {
            switch ($this->menuPositionAtDir) {
                case 'left bottom':
                case 'right bottom':
                    $this->menuPositionYOffset = 4;
                    break;
                case 'left top':
                case 'right top':
                    $this->menuPositionYOffset = -4;
                    break;
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
