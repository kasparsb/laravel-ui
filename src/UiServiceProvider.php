<?php

namespace Kasparsb\Ui;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

use Kasparsb\Ui\View\TableComponentsManager;

class UiServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $this->app->singleton('Kasparsb\Ui\View\TableComponentsManager', function($app) {
            return new TableComponentsManager();
        });
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/resources/views', 'ui');

        Blade::componentNamespace('Kasparsb\\Ui\\View\\Components', 'ui');

        // Relatīvi pret src dir: php artisan vendor:publish
        $this->publishes(
            [
                __DIR__.'/../public' => public_path('vendor/ui'),
            ],
            'public'
        );

    }
}
