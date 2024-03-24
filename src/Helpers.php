<?php

namespace Kasparsb\Ui;

use Illuminate\Database\Eloquent\Model;

class Helpers
{

    /**
     * Model routē ir jāievēro šis naming
     *
     * services = $mode->getTable();
     *
     * Tiek pieņemts, ka model routes veidojas šādi
     * Route::get('/services', 'index')->name('services.index');
     * Route::get('/services/new', 'new')->name('services.new');
     * Route::post('/services', 'create')->name('services.create');
     * Route::get('/services/{id}', 'edit')->name('services.edit');
     * Route::post('/services/{id}', 'update')->name('services.update');
     * Route::delete('/services/{id}', 'delete')->name('services.delete');
     *
     * $routeName šajā gadījumā ir {model}.{routeName}
     */
    public function getModelRoute(Model $model, $routeName) {
        $namespace = $model->getTable();

        // šiem vajag padot model
        if (in_array($routeName, ['edit', 'update', 'delete'])) {
            return route($namespace.'.'.$routeName, $model);
        }

        return route($namespace.'.'.$routeName);
    }
}
