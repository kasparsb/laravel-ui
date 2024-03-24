<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Database\Eloquent\Model;
use Kasparsb\Ui\View\TableComponentsManager;

class TableCol extends Component
{
    public function __construct(
        public $name = '',
        public $type = '',
        // View, kurš tiks renderēts table cell
        public $v = '',
        // button specific attributes
        public $as = '',
        public $link = '',
        public ?Model $model = null,
        // Field specific attributes
        public $placeholder = '',
    )
    {
        $this->manager = app(TableComponentsManager::class);

        $this->index = $this->manager->registerCol($name);
    }

    public function render(): View|Closure|string
    {
        return function ($data) {

            $this->manager->setColData($this->index, $data);

            return '';
        };
    }
}
