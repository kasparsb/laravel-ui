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

    protected function isVideo(): Attribute {
        return Attribute::make(
            get: fn() => substr($this->mime_type, 0, 6) === 'video\\',
        );
    }

    /**
     * Image vai video
     */
    protected function isVisualMedia(): Attribute {
        return Attribute::make(
            get: fn() => $this->is_image || $this->is_video,
        );
    }

    protected function extension(): Attribute {
        return Attribute::make(
            get: fn() => pathinfo($this->path, PATHINFO_EXTENSION),
        );
    }

    /**
     * Šis jātur sync ar FileUpload.js
     */
    protected function fileType(): Attribute {
        return Attribute::make(
            get: function(){
                switch ($this->extension) {
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'bmp':
                    case 'png':
                    case 'svg':
                    case 'tif':
                    case 'tiff':
                    case 'webp':
                        return 'image';
                    case 'zip':
                    case 'bzip':
                    case 'rar':
                    case '7z':
                    case 'gz':
                    case 'tar':
                    case 'bz2':
                    case 'lz':
                    case 'lz4':
                        return 'archive';
                    case 'pdf':
                    case 'doc':
                    case 'docx':
                    case 'xls':
                    case 'xlsx':
                    case 'odt':
                    case 'ods':
                    case 'ots':
                    case 'fods':
                    case 'htm':
                    case 'html':
                        return 'document';
                    case 'mp3':
                    case 'm4a':
                    case 'wav':
                    case 'falc':
                        return 'audio';
                    case 'mp4':
                    case 'avi':
                    case 'mov':
                    case 'flv':
                    case 'avchd':
                        return 'audio';
                    default:
                        return 'document';
                }
            }
        );
    }

    public function getFileSize() {
        return Storage::disk($this->disk)->size($this->path);
    }

    function getFileSizeHuman() {
        $size = $this->getFileSize();
        $i = $size == 0 ? 0 : floor(log($size) / log(1024));
        return (+(round($size / pow(1024, $i), 2)) * 1) . ' ' . ['B', 'kB', 'MB', 'GB', 'TB'][$i];
    }
}
