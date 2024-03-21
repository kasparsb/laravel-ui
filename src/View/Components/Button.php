<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Button extends Component
{
    public function __construct(
        public $variant='primary',
        public $as='', // link, delete
        public $href='', // link href
        public $url='', // url for delete
        public $redirect='', // redirect url after delete
        public $dropdownMenu='',
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
