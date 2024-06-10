<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            // Laravel storage disk name whee file lives
            $table->string('disk');
            $table->string('mime_type');
            // Usually basename, for display in lists etc
            $table->string('title');
            // Path inside a disk. This is not full path in file system
            $table->string('path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
