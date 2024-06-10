<?php

use Illuminate\Http\Request;
use Kasparsb\Ui\FilesManager;

Route::post('/ui/upload', function(FilesManager $filesManager, Request $req) {

    $file = $filesManager->createFromUploadedFile($req->file);

    $r = [
        'is_image' => $file->is_image,
        // Value which will be put in input field as value
        'value' => $file->path,
    ];

    if ($req->return_url) {
        $r['url'] = url($file->url);
    }

    return $r;

})->name('ui::upload');