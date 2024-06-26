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
        return Storage::disk($this->diskName);
    }

    public function createFromUrl($fileUrl) {
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

    public function createFromContent($imageContent, $fileName) {
        $dir = $this->checkDateDir();
        $fileName = $this->getUniqueFileName($dir, $fileName);

        $this->disk()->put($dir.$fileName, $imageContent);

        $image = Image::create([
            'type' => 'default',
            'account_id' => -1,
            'filename' => $dir.$fileName,
        ]);

        return $image;
    }

    public function createFromUploadedFile(UploadedFile $uploadedFile) {
        $dir = $this->checkDateDir();
        $fileName = $this->getUniqueFileName($dir, $uploadedFile->getClientOriginalName());

        $path = $dir.$fileName;

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
            $fileName = $pathInfo['filename'].($i ? '-'.$i : '').'.'.$pathInfo['extension'];
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