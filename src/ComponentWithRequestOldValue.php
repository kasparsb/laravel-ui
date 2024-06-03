<?php

namespace Kasparsb\Ui;

trait ComponentWithRequestOldValue
{
    /**
     * Set old value from request
     */
    public function setOldValue() {
        if ($this->request) {
            if (!is_null($oldValue = $this->request->old($this->name))) {
                $this->value = $oldValue;

                return true;
            }
        }

        return false;
    }

    public function setOldValueCheckbox() {
        if ($this->request) {
            if (!is_null($oldValue = $this->request->old($this->name))) {
                $this->checked = $oldValue ? true : false;
            }
        }
    }
}
