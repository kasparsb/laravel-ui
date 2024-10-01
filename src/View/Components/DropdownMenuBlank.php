<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class DropdownMenuBlank extends Component
{
    public function __construct(
        // Menu name, pēc kura varēs noteikt, kādu menu rādit spiežo uz pogas
        public $name='',

        /**
         * Position koordinātes. Tas ir punkts
         * Tālāk no punkta skatās kāds ir positionDir (virziens)
         * šājā virzienā tiek vilkti stari un content tiek ielikts
         * šo staru veidotajā sturī
         *
         *         right
         *    x,y --------------------------->
         *        | ---------------
         *     b  | |Content tiek |
         *     o  | |likts stūrī  |
         *     t  | ---------------
         *     t  |
         *     o  |
         *     m  |
         *        |
         */
        public $positionX = null,
        public $positionY = null,
        public $positionDir = 'right bottom',
        public $positionXOffset = 0,
        public $positionYOffset = 0,

        /**
         * Element at which position dropdown menu
         *
         * šo varēs override openTrigger elements
         * ja uz triggerEl ir uzlikts data-dropdown-menu-position-at, tad
         * positionEl būs open trigger. Var norādīt query selector, kurš būs
         * relatīvs pret triggerEl
         */
        public $positionAt = false,
        public $positionAtDir = 'right bottom',

        public $hidden = true,
        /**
         * -1 nozīmē, ka var iefokusēt, bet ar Tab nevar
         * ja nebūs tabindex vispār, tad nevarēs vispār iefoksuēt
         *
         * Pēc noklusējuma liekam, ka iefokusēt var ar JS, bet nevar ar Tab
         */
        public $tabIndex = -1,

        /**
         * Child menu itema name, kurš būs selected
         */
        public $item = null, // null nozīmē, ka neviens nebūs selected
    )
    {

    }

    public function render(): View|Closure|string
    {
        return view('ui::components.dropdown-menu-blank');
    }
}
