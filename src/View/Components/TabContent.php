<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class TabContent extends Component
{
    public function __construct(
        public $tabName='', // Tab name, kuram tab atbilst content
        public $selectedTab='', // Kurš tab ir selected. Lai var padod mainīgo nevis pašam taisīt if endif
        public $selected=null,
        public $disableInputs=false, // Vai visiem input laukiem uzlikt disabled, ja tab ir neaktīvs
    )
    {
        if (is_null($this->selected)) {
            $this->selected = $this->tabName == view()->getConsumableComponentData('selected');
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.tab-content');
    }
}
