<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ButtonLink extends Component
{
    public $variant='link';
    public $as='';

    public function __construct(
        public $href='',
        public $url='', // url for delete
        public $redirect='', // redirect url after delete
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.button');
    }
}
