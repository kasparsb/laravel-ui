<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

use Kasparsb\Ui\View\StateManager;

class Svgs extends Component
{
    public $svgsLink;

    public function __construct(
        public $defer=false,
        public $icons=null,
    )
    {
        if (is_null($this->icons)) {
            $this->icons = app(StateManager::class)->queuedSvgIcons;
        }

        $this->svgsLink = route('ui::svgs', ['icons' => $this->icons]);
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.svgs');
    }
}
