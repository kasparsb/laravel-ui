<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

use Kasparsb\Ui\View\StateManager;

class Svgs extends Component
{
    public function __construct(
        public $icons=null,
    )
    {
        if (is_null($this->icons)) {
            $this->icons = app(StateManager::class)->queuedSvgIcons;
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.svgs');
    }
}
