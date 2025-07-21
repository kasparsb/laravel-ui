<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CalendarWeek extends Component
{
    public function __construct(
        public $stateUrl = '', // Url, kuru fetchot, lai iegūtu datumu state
        public $name = '',
        public $value= '',
        public $minDate='',
        public $maxDate='',
        public $state='',
        public $defaultDateState='',

        public $onDateSelect=''
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.calendar-week');
    }
}
