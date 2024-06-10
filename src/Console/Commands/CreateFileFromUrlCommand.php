<?php

namespace Kasparsb\Ui\Console\Commands;

use Illuminate\Console\Command;

use Kasparsb\Ui\FilesManager;

class CreateFileFromUrlCommand extends Command
{
    protected $signature = 'ui:create-file-from-url {url}';
    protected $description = 'Create file by downloading it from url';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle(FilesManager $filesManager)
    {
        $filesManager->createFromUrl($this->argument('url'));
    }
}