<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FileUpload extends Component
{
    public function __construct(
        // Field name, kurā tiks ielikts uploaded file name
        public $name,
        /**
         * Link uz kuru sūtīt failu
         * Pašam jāsaglabā fails
         * līdzi tiek sūtīts url param filename
         * files ir viss post body content
         */
        public $link,
        /**
         * empty - faili nav pievienoti
         * uploading - faili pievienoti
         */
        public $state='empty',
        // Vai var pievienot vairākus failus
        public $multiple=false,

        public $filePickerLabel='Select file to upload',
    )
    {
        if ($multiple) {
            if (substr($this->name, -2) != '[]') {
                $this->name .= '[]';
            }
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload');
    }
}
