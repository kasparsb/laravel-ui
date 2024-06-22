<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Database\Eloquent\Model;

class Page extends Component
{
    public function __construct(
        public $as='div',

        // Ja $as == form
        public $method='post',
        public $action='',
        // Redirect link after form submit
        public $redirect='',
        /**
         * Routes veidojas pēc namig convention
         * Bet, ja vajag, lai route vārdam priekšā
         * ir prefix, tad izmantot šo
         * {prefix}.{modelNamespace}.{action}
         */
        public $redirectRoutePrefix='',
        public ?Model $model=null,
    )
    {
        /**
         * Pēc model nosakām kāda būs form action
         *
         * Model routē ir jāievēro šis naming
         *
         * services = $mode->getTable();
         *
         * Route::get('/services', 'index')->name('services.index');
         * Route::get('/services/new', 'new')->name('services.new');
         * Route::post('/services', 'create')->name('services.create');
         * Route::get('/services/{id}', 'edit')->name('services.edit');
         * Route::post('/services/{id}', 'update')->name('services.update');
         */
        if ($this->as == 'form' && $this->model) {
            $namespace = $this->model->getTable();
            if ($this->model->exists) {
                $this->action = route($namespace.'.update', $this->model);
            }
            else {
                $this->action = route($namespace.'.create');
            }

            // Ja speciāli nav atslēgta redirektēšana pēc form post
            if ($this->redirect !== false) {
                // Ļaujam override redirect linku
                if (!$this->redirect) {
                    $this->redirect = route($namespace.'.index');
                }
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.page');
    }
}
