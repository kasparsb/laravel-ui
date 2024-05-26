<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ProgressBar extends Component
{
    public function __construct(
        public $progress=0,
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.progress-bar');
    }
}
