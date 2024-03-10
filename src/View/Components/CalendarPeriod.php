<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CalendarPeriod extends Component
{
    public function __construct(
        public $size = 8, // date šūnas izmērs
        /**
         * @todo Pārcelt uz pašu kalendāru
         */
        public $stateUrl = '', // Url, kuru fetchot, lai iegūtu datumu state
        public $name = '', // name priekš calendar references
        public $nameFrom = '',
        public $nameTill = '',
        public $from = '',
        public $till = '',
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.calendar-period');
    }
}
