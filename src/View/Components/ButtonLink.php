<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;

class ButtonLink extends Component
{
    public $variant='link';

    public function __construct(
        public $as = '', // link, delete, delete.tableRow, add.tableRow
        public $link = '', // link: priekš href, delete, dinamiskais, ja sākas ar "model:"
        public $redirect = '', // redirect url after delete

        public $menu = '',
        public $menuShow = '',
        public $menuFocus=true, // ko iefokusēt, kad menu atveras. Default pats menu | firstFocusable | querySelector
        public $menuHide = null, // null nozīmē, ka nav uzsetots. Var padot arī empty string vai boolean
        public $menuResetForm = false,
        public $menuPositionAt = '',
        // flase nozīmē, ka triggerEl nenoteiks kāds būs side un align
        public $menuSide = false,
        public $menuAlign = false,
        // Custom position coordinates
        public $menuX = false,
        public $menuY = false,

        public $table = '', // table name, kurai veikt add, delete darbības

        public ?Model $model = null,
        public $disabled = false,
        public $loading = false,
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
