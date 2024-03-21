<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ButtonDanger extends Component
{
    public $variant='danger';

    public function __construct(
        public $as='', // link, ...
        public $href='',
        public $url='', // url for delete
        public $redirect='', // redirect url after delete
        public $menu='',
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
