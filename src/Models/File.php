<?php

namespace Kasparsb\Ui\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

use Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'disk',
        'mime_type',
        'title',
        'path',
    ];

    /**
     * Absolute path in filesystem
     */
    protected function absolutePath(): Attribute {
        return Attribute::make(
            get: fn() => Storage::disk($this->disk)->path($this->path),
        );
    }

    protected function url(): Attribute {
        return Attribute::make(
            get: fn() => Storage::disk($this->disk)->url($this->path),
        );
    }

    protected function isImage(): Attribute {
        return Attribute::make(
            get: fn() => substr($this->mime_type, 0, 6) === 'image\\',
        );
    }
}
