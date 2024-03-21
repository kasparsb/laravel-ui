<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Delimiter extends Component
{
    public function __construct(
        public $dir = 'vertical',
        public $direction = 'vertical',
    )
    {
        if (!$this->direction) {
            $this->direction = $this->dir;
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.delimiter');
    }
}
