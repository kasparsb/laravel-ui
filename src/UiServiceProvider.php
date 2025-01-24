<?php

namespace Kasparsb\Ui;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

use Kasparsb\Ui\Helpers;
use Kasparsb\Ui\View\StateManager;
use Kasparsb\Ui\View\OptionsListManager;
use Kasparsb\Ui\View\TableComponentsManager;
use Kasparsb\Ui\Console\Commands\CreateFileFromUrlCommand;

class UiServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $this->app->singleton('Kasparsb\Ui\View\StateManager', function($app) {
            return new StateManager();
        });
        $this->app->singleton('Kasparsb\Ui\View\OptionsListManager', function($app) {
            return new OptionsListManager();
        });
        $this->app->singleton('Kasparsb\Ui\View\TableComponentsManager', function($app) {
            return new TableComponentsManager();
        });
        $this->app->singleton('Kasparsb\Ui\FilesManager', function($app) {
            return new FilesManager();
        });
        $this->app->singleton('Kasparsb\Ui\Helpers', function($app) {
            return new Helpers();
        });
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/config/ui.php' => config_path('ui.php'),
        ]);

        $this->loadMigrationsFrom(__DIR__.'/database/migrations');

        $this->loadViewsFrom(__DIR__.'/resources/views', 'ui');

        $this->loadRoutesFrom(__DIR__.'/routes/web.php');

        Blade::componentNamespace('Kasparsb\\Ui\\View\\Components', 'ui');

        // Relatīvi pret src dir: php artisan vendor:publish
        $this->publishes(
            [
                __DIR__.'/../public' => public_path('vendor/ui'),
            ],
            'public'
        );

        if ($this->app->runningInConsole()) {
            $this->commands([
                CreateFileFromUrlCommand::class,
            ]);
        }

        $packageJson = json_decode(file_get_contents(__DIR__.'/../package.json'));

        $cacheBuster = '';
        if (config('ui.add_cache_buster')) {
            $cacheBuster = '?r='.time();
        }

        view()->share('ui_dist_css', asset('/vendor/ui/dist/app.min-'.$packageJson->version.'.css'.$cacheBuster));
        view()->share('ui_dist_js', asset('/vendor/ui/dist/app.min-'.$packageJson->version.'.js'.$cacheBuster));
    }
}
