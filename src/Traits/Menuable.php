<?php

namespace Kasparsb\Ui\Traits;

trait Menuable {
    public function setMenuDefaults() {

        // Ja ir menu open trigger
        if ($this->menu) {
            if (!in_array($this->menuShow, ['onclick', 'onhover', 'onfocusin',])) {
                $this->menuShow = 'onclick';
            }

            // Ja tukšs string
            if (is_string($this->menuFocus) && !$this->menuFocus) {
                $this->menuFocus = true;
            }

            if (is_string($this->menuHide)) {
                if (!$this->menuHide) {
                    // Automātiskais aizvēršanas scenārijs
                    $this->menuHide = '_auto';
                }
            }
        }
        else {
            // menu hide bez menu trigger, tas nozīme, ka poga varēs aizvērt menu by name
            if (is_string($this->menuHide)) {
                // empty string nozīmē, ka vajag aizvērt container menu
                if (!$this->menuHide) {
                    $this->menuHide = '_container';
                }
            }
            else if ($this->menuHide) {
                $this->menuHide = '_container';
            }
        }

        /**
         * Ja nav uzlikts menuPositionDir: tas ir nav norādīts kur jānovieto Dropdown menu
         * tad novietojumu uzliekam vadoties pēc menuPositionAtDir: tas ir pēc padotā
         * button stūra pret kuru pozicionēt menu
         * uzliekam arī menuPositionYOffset
         */
        if (!$this->menuPositionDir) {
            switch ($this->menuPositionAtDir) {
                case 'left bottom':
                    $this->menuPositionDir = 'right bottom';
                    break;
                case 'right bottom':
                    $this->menuPositionDir = 'left bottom';
                    break;
                case 'left top':
                    $this->menuPositionDir = 'right top';
                    break;
                case 'right top':
                    $this->menuPositionDir = 'left top';
                    break;
            }
        }

        if ($this->menuPositionYOffset === false) {
            switch ($this->menuPositionAtDir) {
                case 'left bottom':
                case 'right bottom':
                    $this->menuPositionYOffset = 4;
                    break;
                case 'left top':
                case 'right top':
                    $this->menuPositionYOffset = -4;
                    break;
            }
        }
    }
}