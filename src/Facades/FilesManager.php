<?php namespace Kasparsb\Ui\Facades;

use Illuminate\Support\Facades\Facade;

class FilesManager extends Facade {

    protected static function getFacadeAccessor() {
        return \Kasparsb\Ui\FilesManager::class;
    }

}