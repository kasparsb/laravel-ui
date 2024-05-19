<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;

class Button extends Component
{
    public function __construct(
        public $variant = 'primary',
        public $as = '', // link, delete
        public $link = '', // link: priekš href, delete, dinamiskais, ja sākas ar "model:"
        public $redirect = '', // redirect url after delete
        public $menu = '',
        public ?Model $model = null,
        public $disabled = false,
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
