<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Illuminate\Database\Eloquent\Model;

class Form extends Component
{
    public function __construct(
        /**
         * form tags un darbojas kā forma
         * Ja false, tad būs div elements,
         * submit varēs izsaukt programmiski
         * Tas ir gadījumiem, kad vajag pārlādēt
         * html elementu, kurš jau ir ielikts form tagā
         */
        public $asForm=true,
        public $method='post',
        public $action='',
        // Redirect link after form submit
        public $redirect='',
        public $methodSource=false,
        public $actionSource=false,
        /**
         * Kad aizvērt Dropdownmenu, kurā ielikta forma
         * onsubmit, aftersubmit
         * darbojas savādāk, kā Button.menuHide
         */
        public $menuHide=false,
        /**
         * Routes veidojas pēc namig convention
         * Bet, ja vajag, lai route vārdam priekšā
         * ir prefix, tad izmantot šo
         * {prefix}.{modelNamespace}.{action}
         */
        public $redirectRoutePrefix='',
        public ?Model $model=null,

        /**
         * Form will be submitted by javascript via fetch
         */
        public $fetchSubmit=null,

        /**
         * Vai aizvietot atgriezto HTML ar esošo formu?
         */
        public $replaceHtml=false,

        // Ja atrodas iekš menuEl, bet vajag replaceHtml uz pogas, kas atvēra menu
        // tagad darbojas tikai šis: dropdownMenuOpenTrigger
        public $replaceHtmlTarget=false,

        /**
         * Vai atjaunot formu sākuma stāvoklī pēc submit
         */
        public $resetFormAfterSubmit=false,

        /**
         * Iespēja norādīt, laiku (ms) pēc kāda notiek automātisks submit
         * šo var izmantot kā polling, ja ir jāgaida garāka fona procesa rezultāts
         */
        public $submitAfterMs=false,
    )
    {
        if (!$asForm) {
            /**
             * Ja ir formas aizvietotājs, tad liekam fetchSubmit automātiski,
             * jo form submit nevar notikt un tā pat submit ir jāpārķer ar JS
             */
            $this->fetchSubmit = true;
        }

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
        if ($this->model) {
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

        // Nav norādīts fetchSumbit, tad replaceHtml gadījumā liekam kā true
        if (is_null($this->fetchSubmit)) {
            if ($this->replaceHtml) {
                $this->fetchSubmit = true;
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.form');
    }
}
