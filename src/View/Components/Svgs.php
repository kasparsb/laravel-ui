<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Svgs extends Component
{
    public $svgsLink;

    public function __construct(
        public $defer=false,
    )
    {
        $this->svgsLink = route('ui::svgs');
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.svgs');
    }
}
