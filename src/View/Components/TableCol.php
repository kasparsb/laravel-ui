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
        // Additional variables form view
        public $vData = [],
        // button specific attributes
        public $as = '',
        public $link = '',
        public ?Model $model = null,
        // Field specific attributes
        public $placeholder = '',
        public $selectOptions = [],
        public $readonly = false,
        // Field select options source url
        public $selectSourceUrl = false,
        public $selectValueVisualUrl = false,
        public $selectLoadInitialValueVisual = false,
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
