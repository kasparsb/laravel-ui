<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FileUploadSingleFile extends Component
{
    public function __construct(
        public $name='',
        // Pēc noklusējuma atgriežam file path. Vēl ir opcija atrgreizt file id
        public $valueField='path',
        public $value='',
        public $fileType='document',
        public $progress=0,
        public $fileName=null,
        public $fileDescription=null,
        public $error=null,
        /**
         * ready - fails ir pievienots un gatavs upload
         * uploading - notiek file upload
         * failed - notika kļūda
         * completed upload pabeigts
         */
        public $state='ready',
        // Should uploaded image be previewed
        public $previewImage=false,

        // Models/File instance or any other, that have same fields
        public $model=null,
        // Allow file downlonad
        public $downloadable=false,
        public $linkDownload=null,
        // Vai rādīt remove button
        public $removable=false,
    )
    {
        if ($this->model) {
            $this->fileName = $this->model->title;
            $this->fileDescription = $this->model->getFileSizeHuman();

            // File upload jau ir veikts. Tiek rādīts jau ielādēts fails
            $this->state = 'existing';

            if (!$this->value) {
                $this->value = $this->model->{$this->valueField};
            }
        }

        if ($this->downloadable && $this->model) {
            if (!$this->linkDownload) {
                $this->linkDownload = route('ui::download', $this->model);
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload-single-file');
    }
}
