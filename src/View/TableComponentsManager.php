<?php

namespace Kasparsb\Ui\View;

use Illuminate\View\ComponentAttributeBag;

/**
 * Ārējais state priekš component Table
 * Lai table var piereģistrēt kādas TableCol komponentes ir
 * izsauktas Table komponentē kā bērni
 * No šīm TableCol tiks ģenerētas table rows
 * No TableCol tiek paņemts slot, name, type
 */
class TableComponentsManager
{
    public $tablesStack = [];

    public function registerTable($colsFormatter) {
        $tablesCount = array_push($this->tablesStack, (object)[
            'colsFormatter' => $colsFormatter,
            'cols' => []
        ]);

        return $tablesCount - 1;
    }

    /**
     * Col tiek reģistrēts tabulā, kura ir pēdējā
     * Laravel View ģenerē vienu pēc otra. Pirmā ienāks tabula,
     * tad ienāks attiecīgās kolonnas.
     * Kamēr vien neuzrodas jauna tabula. Tikko jauna tabula, tā
     * visas nākošās kolonnas tiks reģistrēts tajā tabulā
     */
    public function registerCol($colName) {
        $tableIndex = count($this->tablesStack) - 1;

        $colsCount = array_push($this->tablesStack[$tableIndex]->cols, (object)[
            'isCheckboxCol' => false,
            'isActionsCol' => false,
            'isDeleteCol' => false,
            'isHidden' => false,
            'name' => $colName,
            // šis būs tekstuālais kolonnas nosaukums
            'slot' => $colName,
            // default. Izvada colonnas string vērtību
            'type' => 'text',
            'attributes' => null,
        ]);

        return (object)[
            'table' => $tableIndex,
            'col' => $colsCount - 1,
            //'attributes'
        ];
    }

    public function registerColHidden($colName) {
        $tableIndex = count($this->tablesStack) - 1;

        $colsCount = array_push($this->tablesStack[$tableIndex]->cols, (object)[
            'isCheckboxCol' => false,
            'isActionsCol' => false,
            'isDeleteCol' => false,
            'isHidden' => true,
            'name' => $colName,
            // šis būs tekstuālais kolonnas nosaukums
            'slot' => $colName,
            // default. Izvada colonnas string vērtību
            'type' => 'text',
            'attributes' => null,
        ]);

        return (object)[
            'table' => $tableIndex,
            'col' => $colsCount - 1,
            //'attributes'
        ];
    }

    public function registerColCheckbox($colName) {
        $tableIndex = count($this->tablesStack) - 1;

        $colsCount = array_push($this->tablesStack[$tableIndex]->cols, (object)[
            'isCheckboxCol' => true,
            'isActionsCol' => false,
            'isDeleteCol' => false,
            'isHidden' => false,
            'name' => $colName,
            'attributes' => null,
        ]);

        return (object)[
            'table' => $tableIndex,
            'col' => $colsCount - 1,
            //'attributes'
        ];
    }

    /**
     * Actions button uz kura nospiešanas atveras actions menu
     * DropDown menu ir jāreģistrē pašam. Jāpadod menu name
     */
    public function registerColActions($menu, $menuShow) {
        $tableIndex = count($this->tablesStack) - 1;

        $colsCount = array_push($this->tablesStack[$tableIndex]->cols, (object)[
            'isCheckboxCol' => false,
            'isActionsCol' => true,
            'isDeleteCol' => false,
            'isHidden' => false,
            'name' => '',
            'attributes' => null,
        ]);

        return (object)[
            'table' => $tableIndex,
            'col' => $colsCount - 1,
            'menu' => $menu,
            'menuShow' => $menuShow,
            //'attributes'
        ];
    }

    /**
     * Table row delete poga
     */
    public function registerColDelete() {
        $tableIndex = count($this->tablesStack) - 1;

        $colsCount = array_push($this->tablesStack[$tableIndex]->cols, (object)[
            'isCheckboxCol' => false,
            'isActionsCol' => false,
            'isDeleteCol' => true,
            'isHidden' => false,
            'name' => '',
            'attributes' => null,
        ]);

        return (object)[
            'table' => $tableIndex,
            'col' => $colsCount - 1,
            //'attributes'
        ];
    }

    public function getCols($tableIndex) {
        $cols = $this->tablesStack[$tableIndex]->cols;

        // Ja table ir editable, tad make sure, ka ir id kolonna
        // ja nav, tad uztaisa hidden kolonnu
        $hasIdCol = collect($cols)->firstWhere('name', 'id');

        if (!$hasIdCol) {
            array_unshift($cols, (object)[
                'isCheckboxCol' => false,
                'isActionsCol' => false,
                'isDeleteCol' => false,
                'isHidden' => true,
                'name' => 'id',
            ]);
        }

        $cols = array_map(function($col){
            if ($col->isHidden) {
                $col->attributes = new ComponentAttributeBag([
                    'hidden' => true,
                ]);
            }
            return $col;
        }, $cols);

        return $cols;
    }

    /**
     * Uzstāda $data, kas tiek padots uz TableCol render metodi
     * tie ir visi mainīgie, kas būs pieejami view
     */
    public function setColData($index, $data) {
        foreach ($data as $field => $value) {
            $this->tablesStack[$index->table]->cols[$index->col]->{$field} = $value;
        }
    }
}
