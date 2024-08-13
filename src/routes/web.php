<?php

use Illuminate\Http\Request;
use Kasparsb\Ui\FilesManager;
use Kasparsb\Ui\Models\File;
use Illuminate\Support\Facades\Storage;

Route::post('/ui/upload', function(FilesManager $filesManager, Request $req) {

    $file = $filesManager->createFromUploadedFile($req->file);

    $valueField = 'path';
    if ($req->value_field == 'id') {
        $valueField = 'id';
    }

    $r = [
        'is_image' => $file->is_image,
        // Value which will be put in input field as value
        'value' => $file->{$valueField},
    ];

    if ($req->return_url) {
        $r['url'] = url($file->url);
    }

    return $r;

})->name('ui::upload');

Route::get('/ui/download/{id}', function(FilesManager $filesManager, Request $req) {

    $file = File::findOrFail($req->id);

    return Storage::disk($file->disk)->download($file->path);

})->name('ui::download');