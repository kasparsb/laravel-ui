<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

/**
 * Šis ir vajadzīgs priekš Repeatable, lai norādītu
 * kurā vietā būs repeatable items
 * Gadījumā, kad nav neviena item, tad vajag norādīt, kur tiem jābūt
 */
class RepeatableBlankItem extends Component
{
    public function __construct()
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.repeatable-blank-item');
    }
}
