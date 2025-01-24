<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class LayoutTopMenu extends Component
{
    public function __construct(

    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.layout-top-menu');
    }
}
