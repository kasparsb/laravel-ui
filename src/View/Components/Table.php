<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\View\ComponentAttributeBag;

use Kasparsb\Ui\View\TableComponentsManager;

class Table extends Component
{
    public $manager;

    public function __construct(
        // Data
        public $rows = [],
        public $formatter = null,
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

        if ($col->type == 'field-text') {
            return view('ui::components.field-text', [
                'attributes' => new ComponentAttributeBag(),
                'label' => '',
                'name' => $col->name,
                'value' => $value,
                'placeholder' => $col->placeholder,
                'description' => '',
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
                'state' => ''
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
        else if ($col->type == 'button-outline') {
            return view('ui::components.button', [
                'attributes' => new ComponentAttributeBag(),
                'variant' => 'outline',
                'as' => $col->as,
                'link' => $col->link,
                'model' => $row,
                'menu' => '',
                /**
                 * TODO kā dabūt button label no table col
                 */
                'slot' => 'Edit'

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
