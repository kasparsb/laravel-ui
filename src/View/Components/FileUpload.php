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
         *
         * pēc noklusējuma route('ui::upload')
         */
        public $link=null,
        /**
         * empty - faili nav pievienoti
         * uploading - faili pievienoti
         */
        public $state='empty',
        // Vai var pievienot vairākus failus
        public $multiple=false,

        public $filePickerLabel='Select file to upload',
        // Should uploaded image be previewed
        public $preview=false,

        // Pēc noklusējuma atgriežam file path. Vēl ir opcija atrgreizt file id
        public $valueField='path',

        // Jau izveidoti File modeļu kolekcija
        public $files=null,
        public $file=null,

        // Vai var pievienot jaunus failus
        public $canAdd=true,
        public $canRemove=true,
        public $canDownload=false,

        /**
         * Set form busy while uploading
         */
        public $setFormBusy=true,
    )
    {
        if ($multiple) {
            if (substr($this->name, -2) != '[]') {
                $this->name .= '[]';
            }
        }

        if (!$this->link) {
            $this->link = route('ui::upload');
        }

        // Viens fails tiek pārtaisīts par iterable
        if ($this->files && $this->file) {
            $this->files = [$this->file];
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.file-upload');
    }
}
