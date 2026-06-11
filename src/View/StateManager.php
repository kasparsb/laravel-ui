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

    public $queuedSvgIcons = [];

    public $queuedComponentScripts = [];

    public function queueSvgIcon($iconId) {
        if (!in_array($iconId, $this->queuedSvgIcons)) {
            $this->queuedSvgIcons[] = $iconId;
        }
    }

    public function queueSvgIcons($iconIds) {
        foreach ($iconIds as $iconId) {
            $this->queueSvgIcon($iconId);
        }
    }

    public function queueComponentScript($component) {
        if (!in_array($component, $this->queuedComponentScripts)) {
            $this->queuedComponentScripts[] = $component;
        }
    }

    public function queueComponentScripts($components) {
        foreach ($components as $component) {
            $this->queueComponentScript($component);
        }
    }

    public function flushQueuedComponentScripts() {
        $componentScripts = $this->queuedComponentScripts;
        $this->queuedComponentScripts = [];

        return $componentScripts;
    }
}
