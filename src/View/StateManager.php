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
    private $timePickerMenu = false;

    public function isTimePickerMenu() {
        return $this->timePickerMenu;
    }

    public function setIsTimePickerMenu() {
        $this->timePickerMenu = true;
    }
}
