<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;
use Kasparsb\Ui\View\TableComponentsManager;

class TableColDelete extends Component
{
    public function __construct(
    )
    {
        $this->manager = app(TableComponentsManager::class);

        $this->index = $this->manager->registerColDelete();
    }

    public function render(): View|Closure|string
    {
        return function ($data) {

            $this->manager->setColData($this->index, $data);

            return '';
        };
    }
}
