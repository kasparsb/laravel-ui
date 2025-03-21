<?php

namespace Kasparsb\Ui;

use Storage;
use Illuminate\Http\UploadedFile;

use Kasparsb\Ui\Models\File;

class FilesManager {

    private $diskName;

    public function __construct() {
        $this->diskName = config('ui.files_disk');
    }

    private function disk() {
        if (!$this->diskName) {
            throw new \Exception('Files upload there is no configuration of ui.files_disk');
        }
        return Storage::disk($this->diskName);
    }

    public function createFromUrl($fileUrl) {

        // Pārbaudām vai ir norādīts protocol
        if (substr($fileUrl, 0, 2) == '//') {
            $fileUrl = 'https:'.$fileUrl;
        }

        $dir = $this->checkDateDir();
        $fileName = $this->getUniqueFileName($dir, $fileUrl);

        $path = $dir.$fileName;

        $this->disk()->put($path, file_get_contents($fileUrl));

        $file = File::create([
            'disk' => $this->diskName,
            'mime_type' => $this->disk()->mimeType($path),
            'title' => $fileName,
            'path' => $path,
        ]);

        return $file;
    }

    public function createFromContent($fileContent, $fileName) {
        $dir = $this->checkDateDir();
        $fileName = $this->getUniqueFileName($dir, $fileName);

        $path = $dir.$fileName;

        $this->disk()->put($dir.$fileName, $fileContent);

        $file = File::create([
            'disk' => $this->diskName,
            'mime_type' => $this->disk()->mimeType($path),
            'title' => $fileName,
            'path' => $path,
        ]);

        return $file;
    }

    public function createFromUploadedFile(UploadedFile $uploadedFile) {
        $dir = $this->checkDateDir();
        $fileName = $this->getUniqueFileName($dir, $uploadedFile->getClientOriginalName());

        $path = $dir.$fileName;

        /**
         * TODO vajag pārbaudīt vai uploaded file tiešām ir
         * ja php max_upload size ir mazāks, tad faile nebūs
         *
         * tas var gadīties, ja nginx ir 100Mb, bet php 2Mb, tad
         * nginx izlaidīs cauri, bet php pusē būs failed
         */

        $uploadedFile->storeAs(
            $dir, $fileName, $this->diskName
        );

        $file = File::create([
            'disk' => $this->diskName,
            'mime_type' => $this->disk()->mimeType($path),
            'title' => $fileName,
            'path' => $path,
        ]);

        return $file;
    }

    private function checkDateDir($date=null) {
        if (!$date) {
            $date = now();
        }
        $year = $date->format('Y');
        $month = $date->format('m');
        $date = $date->format('d');

        $disk = $this->disk();

        if (!$disk->exists($year)) {
            $disk->makeDirectory($year);
        }

        if (!$disk->exists($year.'/'.$month)) {
            $disk->makeDirectory($year.'/'.$month);
        }

        if (!$disk->exists($year.'/'.$month.'/'.$date)) {
            $disk->makeDirectory($year.'/'.$month.'/'.$date);
        }

        return $year.'/'.$month.'/'.$date.'/';
    }

    function getUniqueFileName($dir, $filePathOrName) {

        $disk = $this->disk();

        // Liekam counter faila vārdā kamēr atrodam unique
        $pathInfo = pathinfo($filePathOrName);

        $i = false;
        while (true) {
            $fileName = $pathInfo['filename'].($i ? '-'.$i : '');
            // Pārbaudām vai ir extension
            if (isset($pathInfo['extension'])) {
                $fileName .= '.'.$pathInfo['extension'];
            }
            // Sākumā pārbaudām vai padotais fails eksistē
            if (!$disk->exists($dir.$fileName)) {
                $disk->put($dir.$fileName, '');

                return $fileName;
            }

            if (!$i) {
                $i = 1;
            }
            $i++;
        }
    }
}