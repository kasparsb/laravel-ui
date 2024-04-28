<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;
use Illuminate\View\ComponentAttributeBag;
use Illuminate\Support\Facades\View as FacadeView;

use Kasparsb\Ui\View\TableComponentsManager;

class Table extends Component
{
    public $manager;

    public function __construct(
        // Data
        public $rows = [],
        public $formatter = null,
        public $submitable = false,
        public $routeCreate = '',
        public $routeUpdate = '',
    )
    {
        // Klases, kura nodrošinās cell vērtību formatēšanu
        if ($this->formatter) {
            $this->formatter = new $this->formatter();
        }

        $this->manager = app(TableComponentsManager::class);
        $this->index = $this->manager->registerTable($this->formatter);
    }

    public function cols() {
        return $this->manager->getCols($this->index);
    }

    /**
     * Generate cell content for current row
     */
    public function cellContent($col, $row) {
        $value = data_get($row, $col->name);

        // Custom view
        if ($col->v && FacadeView::exists($col->v)) {
            return view($col->v, [
                'name' => $col->name,
                'row' => $row,
                'value' => $value,
            ])->render();
        }

        if ($col->type == 'field-text') {
            return view('ui::components.field-text', [
                'attributes' => new ComponentAttributeBag(),
                'label' => '',
                'name' => $col->name,
                'value' => $value,
                'placeholder' => $col->placeholder,
                'description' => '',
                'disabled' => false,
            ])->render();
        }
        else if ($col->type == 'field-date') {
            return view('ui::components.field-date', [
                'attributes' => new ComponentAttributeBag(),
                'label' => '',
                'name' => $col->name,
                'value' => $value,
                'placeholder' => $col->placeholder,
                'description' => '',
                'stateUrl' => '',
                'minDate' => '',
                'maxDate' => '',
                'defaultDateState' => '',
                'state' => '',
                'disabled' => false,
            ])->render();
        }
        else if ($col->type == 'toggle-switch') {
            return view('ui::components.toggle-switch', [
                'attributes' => new ComponentAttributeBag(),
                'label' => '',
                'labelPosition' => 'right',
                'name' => $col->name,
                'checked' => $value ? true : false,
                'placeholder' => $col->placeholder,
                'description' => '',
            ])->render();
        }
        else {
            $methodName = 'col'.ucfirst($col->name);
            // Kolonnas dedicated formatter
            if ($this->formatter && method_exists($this->formatter, $methodName)) {
                return $this->formatter->{$methodName}($row);
            }
            // Pēc kolonnas tipa
            $methodName = 'type'.ucfirst($col->type);
            // Kolonnas dedicated formatter
            if ($this->formatter && method_exists($this->formatter, $methodName)) {
                return $this->formatter->{$methodName}($row);
            }
        }

        // Vērtība bez formatēšanas
        return $value;
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.table');
    }
}
