<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;
use Illuminate\View\ComponentAttributeBag;
use Illuminate\Support\Facades\View as FacadeView;

use Kasparsb\Ui\View\Components\Button;
use Kasparsb\Ui\View\Components\Checkbox;
use Kasparsb\Ui\View\Components\FieldDate;
use Kasparsb\Ui\View\Components\FieldText;
use Kasparsb\Ui\View\Components\FieldSelect;
use Kasparsb\Ui\View\Components\FieldToggleSwitch;

use Kasparsb\Ui\View\TableComponentsManager;


class Table extends Component
{
    public $manager;

    public function __construct(
        // Data
        public $rows = [],
        public $formatter = null,
        public $name = '',
        /**
         * Ja true, tad dzēstiem tabulas ieraksti tik saglabāti tabulā, kā hidden
         * ierakstam tiks pielikts hidden input lauks _deleted
         * Pēc šī lauka servera pusē zinās, ka šo ierakstu vajag dzēst
         */
        public $trackDeleted = false,
    )
    {
        // Klases, kura nodrošinās cell vērtību formatēšanu
        if ($this->formatter) {
            $this->formatter = new $this->formatter();
        }

        if ($this->trackDeleted) {
            if (is_bool($this->trackDeleted)) {
                $this->trackDeleted = '_deleted';
            }
        }

        $this->manager = app(TableComponentsManager::class);
        $this->index = $this->manager->registerTable($this->formatter);
    }

    /**
     * Generate cell content for current row
     */
    public function cellContent($col, $row, $rowIndex) {
        $value = data_get($row, $col->name);

        if ($col->isCheckboxCol) {
            return $this->cellContentCheckbox($col, $rowIndex, $value);
        }
        else if ($col->isActionsCol) {
            return view(
                'ui::components.table-col-actions',
                [
                    'menu' => $col->menu,
                    'menuShow' => $col->menuShow,
                    'menuPositionDir' => $col->menuPositionDir,
                    'menuPositionAtDir' => $col->menuPositionAtDir,
                ]
            )->render();
        }
        else if ($col->isDeleteCol) {
            return view(
                'ui::components.table-col-delete'
            )->render();
        }
        else if ($col->isHidden) {
            return '<input type="hidden" name="'.$this->fieldName($col->name, $rowIndex).'" value="'.$value.'" />';
        }



        // Custom view
        if ($col->v && FacadeView::exists($col->v)) {

            $viewData = $col->vData;
            if (!is_array($viewData)) {
                $viewData = [];
            }

            $viewData['name'] = $col->name;
            $viewData['row'] = $row;
            $viewData['value'] = $value;

            return view($col->v, $viewData)->render();
        }

        /**
         * Field type
         */
        if ($col->type == 'field-text') {
            return view(
                'ui::components.field-text',
                $this->getClassConstructorParameters(FieldText::class, [
                    'attributes' => new ComponentAttributeBag([
                        'class' => 'bw-0',
                    ]),
                    'name' => $this->fieldName($col->name, $rowIndex),
                    'value' => $value,
                    'placeholder' => $col->placeholder,
                    'readonly' => $col->readonly,
                ])
            )->render();
        }
        else if ($col->type == 'field-date') {
            return view(
                'ui::components.field-date',
                $this->getClassConstructorParameters(FieldDate::class, [
                    'attributes' => new ComponentAttributeBag([
                        'class' => 'bw-0',
                    ]),
                    'name' => $this->fieldName($col->name, $rowIndex),
                    'value' => $value,
                    'placeholder' => $col->placeholder,
                ])
            )->render();
        }
        else if ($col->type == 'field-select') {
            return view(
                'ui::components.field-select',
                $this->getClassConstructorParameters(FieldSelect::class, [
                    'attributes' => new ComponentAttributeBag([
                        'class' => 'bw-0',
                    ]),
                    'name' => $this->fieldName($col->name, $rowIndex),
                    'value' => $value,
                    'options' => $col->selectOptions,
                    'sourceUrl' => $col->selectSourceUrl,
                    'valueVisualUrl' => $col->selectValueVisualUrl,
                    'loadInitialValueVisual' => $col->selectLoadInitialValueVisual,
                    'placeholder' => $col->placeholder,
                ])
            )->render();
        }
        else if ($col->type == 'toggle-switch') {
            return view(
                'ui::components.toggle-switch',
                $this->getClassConstructorParameters(FieldToggleSwitch::class, [
                    'attributes' => new ComponentAttributeBag(),
                    'labelPosition' => 'right',
                    'name' => $this->fieldName($col->name, $rowIndex),
                    'checked' => $value ? true : false,
                    'placeholder' => $col->placeholder,
                ])
            )->render();
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

    public function cellContentCheckbox($col, $rowIndex=null, $value=null) {
        return view(
            'ui::components.checkbox',
            $this->getClassConstructorParameters(Checkbox::class, [
                'attributes' => new ComponentAttributeBag([
                    'data-r' => 'tableRowCheck',
                ]),
                'name' => $this->fieldName($col->name, $rowIndex),
                'checked' => false,
                'value' => $value,
            ])
        )->render();
    }

    public function getClassConstructorParameters($className, $append=null) {
        $class = new \ReflectionClass($className);
        $constructor = $class->getConstructor();
        $params = collect($constructor->getParameters())
            ->mapWithKeys(function($parameter){
                return [$parameter->getName() => $parameter->getDefaultValue()];
            })
            ->all();

        if ($append) {
            foreach ($append as $name => $value) {
                $params[$name] = $value;
            }
        }

        return $params;
    }

    public function fieldName($fieldName, $rowIndex=null) {
        if (!$fieldName) {
            return '';
        }
        if (is_null($rowIndex)) {
            return '';
        }
        return $this->name.'['.$rowIndex.']['.$fieldName.']';
    }

    public function cols() {
        return $this->manager->getCols($this->index);
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.table');
    }
}
