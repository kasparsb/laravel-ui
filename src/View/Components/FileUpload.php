<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FileUpload extends Component
{
    public function __construct(
        // Storage disk, kurā upload file
        public $disk,
        // Field name, kurā tiks ielikts uploaded file name
        public $name,
        /**
         * empty - faili nav pievienoti
         * uploading - faili pievienoti
         */
        public $state='empty',
        // Vai var pievienot vairākus failus
        public $multiple=false,

        public $fileType='document',
        public $progress=0,
        public $fileName=null,
        public $fileDescription=null,
        public $error=null,
    )
    {
        //
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload');
    }
}
