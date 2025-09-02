<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;
use Kasparsb\Ui\View\TableComponentsManager;

class TableColHidden extends Component
{
    public function __construct(
        public $name = '',
    )
    {
        $this->manager = app(TableComponentsManager::class);

        $this->index = $this->manager->registerColHidden($this->name);
    }

    public function render(): View|Closure|string
    {
        return function ($data) {

            $this->manager->setColData($this->index, $data);

            return '';
        };
    }
}
