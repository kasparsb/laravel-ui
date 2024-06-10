<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FileUploadSingleFile extends Component
{
    public function __construct(
        public $name='',
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
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload-single-file');
    }
}
