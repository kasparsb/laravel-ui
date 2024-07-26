<?php

namespace Kasparsb\Ui\View;

use Illuminate\View\ComponentAttributeBag;

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
    public $istimePickerMenu = false;

    public $isFieldDateCalendarMenu = false;
}
