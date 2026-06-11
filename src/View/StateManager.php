<?php

namespace Kasparsb\Ui\View;

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
        return $this->queueSvgIcons([$iconId]);
    }

    public function queueSvgIcons($iconIds) {
        if (is_string($iconIds)) {
            $iconIds = [$iconIds];
        }

        $queuedIcons = [];

        foreach ($iconIds as $iconId) {
            if (!$iconId) {
                continue;
            }

            if (!in_array($iconId, $this->queuedSvgIcons)) {
                $this->queuedSvgIcons[] = $iconId;
            }

            if (!in_array($iconId, $queuedIcons)) {
                $queuedIcons[] = $iconId;
            }
        }

        if (!count($queuedIcons)) {
            return '';
        }

        return '<template data-ui-svg-icons="'.
            htmlspecialchars(implode(' ', $queuedIcons), ENT_QUOTES, 'UTF-8').
            '"></template>';
    }

    public function queueComponentScript($component) {
        return $this->queueComponentScripts([$component]);
    }

    public function queueComponentScripts($components) {
        if (is_string($components)) {
            $components = [$components];
        }

        $queuedComponents = [];

        foreach ($components as $component) {
            if (!$component) {
                continue;
            }

            if (!in_array($component, $this->queuedComponentScripts)) {
                $this->queuedComponentScripts[] = $component;
            }

            if (!in_array($component, $queuedComponents)) {
                $queuedComponents[] = $component;
            }
        }

        if (!count($queuedComponents)) {
            return '';
        }

        return '<template data-ui-component-scripts="'.
            htmlspecialchars(implode(' ', $queuedComponents), ENT_QUOTES, 'UTF-8').
            '"></template>';
    }

    public function flushQueuedComponentScripts() {
        $componentScripts = $this->queuedComponentScripts;
        $this->queuedComponentScripts = [];

        return $componentScripts;
    }
}
