<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;

class Container extends Component
{
    public function __construct(
        public $loading=false,
        public $loadingStyle="ui-faded-ghost",
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.container');
    }
}
