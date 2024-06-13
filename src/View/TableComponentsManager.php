<?php

namespace Kasparsb\Ui\View;

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

    public function getCols($tableIndex) {
        return $this->tablesStack[$tableIndex]->cols;
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
