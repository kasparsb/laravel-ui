<?php

namespace Kasparsb\Ui\View;

use Illuminate\Support\Str;

/**
 * State priekš laukiem
 */
class StateManager
{
    /**
     * Vai ir izvadīta time picker menu
     * šo vajag tikai vienu
     * Katrs time picker lauks pārbaudīs vai menu ir jau izvadīts
     */
    public $isTimePickerMenu = false;

    public $isFieldDateCalendarMenu = false;
}
