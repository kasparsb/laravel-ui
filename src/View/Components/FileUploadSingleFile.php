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
        public $preview=false,
        public $previewAspectRatio=null,

        // Default aspect ration priekš visiem failu tipiem
        public $previewAspectRatioDefault='3:1',
        // Default aspect ratio priekš image/video
        public $previewAspectRatioDefaultVisualMedia='4:3',

        // File Model instance or any other, that have same fields
        public $file=null,

        // Allow file downlonad
        public $canDownload=false,
        public $downloadLink=null,

        // Vai rādīt remove button
        public $canRemove=false,
    )
    {
        if ($this->file) {
            $this->fileName = $this->file->title;
            $this->fileDescription = $this->file->getFileSizeHuman();

            // File upload jau ir veikts. Tiek rādīts jau ielādēts fails
            $this->state = 'existing';

            if (!$this->value) {
                $this->value = $this->file->{$this->valueField};
            }

            if ($this->file->is_visual_media) {
                if (!$this->previewAspectRatio) {
                    $this->previewAspectRatio = '1:1';
                }
            }
        }

        if (!$this->previewAspectRatio) {
            $this->previewAspectRatio = '3:1';
        }

        if ($this->canDownload && $this->file) {
            if (!$this->downloadLink) {
                $this->downloadLink = route('ui::download', $this->file);
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload-single-file');
    }
}
