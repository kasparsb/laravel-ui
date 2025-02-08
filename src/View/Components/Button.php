<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;

use Kasparsb\Ui\Traits\Menuable;

class Button extends Component
{
    use Menuable;

    public $variantOverride = 'primary';

    public function __construct(
        public $variant='',
        public $as='', // link, delete, delete.tableRow, add.tableRow
        public $link='', // link: priekš href, delete, dinamiskais, ja sākas ar "model:"
        public $redirect='', // redirect url after delete
        public $replaceHtml=false,
        // Ja atrodas iekš menuEl, bet vajag replaceHtml uz pogas, kas atvēra menu
        // tagad darbojas tikai šis: dropdownMenuOpenTrigger
        public $replaceHtmlTarget=false,

        public $menu='',
        public $menuShow='',
        public $menuFocus=false, // ko iefokusēt, kad menu atveras. Default pats menu | firstFocusable | querySelector
        /**
         * Tukšs string nozīmē, ka vajag slēpt automātiski
         * onclick.outside
         * onfocusout
         * boolean false nozīmē, ka nevajag automātiski slēpt
         *     explicitly ar menuHide="{menuName}" tiks aizvērts
         */
        public $menuHide=null,
        public $menuResetForm=false,

        /**
         * Custom position coordinates
         * *Skatīties DropdownMenu aprakstu par to kā veidojas koordinātes
         */
        public $menuPositionX=false,
        public $menuPositionY=false,
        public $menuPositionDir=null,
        public $menuPositionXOffset=false,
        public $menuPositionYOffset=false,
        // Elements pret kuru pozicionēt ir pati poga
        public $menuPositionAt='',
        // Dir tiek ņemts no Dropdown defaults
        public $menuPositionAtDir='left bottom',

        public $table='', // table name, kurai veikt add, delete darbības

        public $linkSource = '', // data-{attribute name} lai varētu link ielasīt no click trigger el
        public $redirectSource = '', // data-{attribute name} lai varētu link ielasīt no click trigger el

        public ?Model $model=null,
        public $disabled=false,
        /**
         * onclick
         * onsubmit - notiks, tikai, ja poga ir form elementā
         */
        public $loading=false,

        public $tabindex=true,
    )
    {
        if (!$this->variant) {
            $this->variant = $this->variantOverride;
        }
        $this->setMenuDefaults();
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
