<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Header extends Component
{
    public function __construct(
        public $title='',
        public $description='',
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.header');
    }
}
