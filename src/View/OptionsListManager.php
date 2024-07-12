<?php

namespace Kasparsb\Ui\View;

use Illuminate\View\ComponentAttributeBag;

/**
 * State priekš unikālu options list name ģenerēšanas
 * pa liekam tas būs counter
 */
class OptionsListManager
{
    private $idCounter = 0;

    public function getNextId() {
        return 'options-list-'.$this->idCounter++;
    }
}
