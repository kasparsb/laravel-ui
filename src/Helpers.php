<?php

namespace Kasparsb\Ui;

use Illuminate\Database\Eloquent\Model;

class Helpers
{

    /**
     * Model routē ir jāievēro šis naming
     *
     * services = $mode->getTable();
     *
     * Tiek pieņemts, ka model routes veidojas šādi
     * Route::get('/services', 'index')->name('services.index');
     * Route::get('/services/new', 'new')->name('services.new');
     * Route::post('/services', 'create')->name('services.create');
     * Route::get('/services/{id}', 'edit')->name('services.edit');
     * Route::post('/services/{id}', 'update')->name('services.update');
     * Route::delete('/services/{id}', 'delete')->name('services.delete');
     *
     * $routeName šajā gadījumā ir {model}.{routeName}
     */
    public function getModelRoute(Model $model, $routeName) {
        $namespace = $model->getTable();

        // šiem vajag padot model
        if (in_array($routeName, ['edit', 'update', 'delete'])) {
            return route($namespace.'.'.$routeName, $model);
        }

        return route($namespace.'.'.$routeName);
    }

    public function hasClass($classesString, $classNameToFind) {
        return in_array($classNameToFind, explode(' ', $classesString));
    }

    /**
     * No padotā classes string meklējam vai kāda no klasēm
     * ir mt-{number} klases
     * Ja ir atrasta, tad atgriež true
     */
    public function hasAnyMarginTopClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^mt-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyPaddingClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^(p|px|py|)-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyWidthClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            if ($class == 'w-full') {
                return true;
            }

            preg_match('/^w-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyTextSizeClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^t-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyTextAlignClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^ta-(.*)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyFontWeightClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^fw-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyColorClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^c-(.*)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyBorderColorClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^b-c([^0-9]*)-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyBorderStyleClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^b-s-([^0-9]*)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyBorderWidthClass($classesString) {
        if (!$classesString) {
            return false;
        }

        $classesString = explode(' ', $classesString);
        foreach ($classesString as $class) {
            preg_match('/^bw-(\d+(\.\d+)?)$/', $class, $matches);

            if (count($matches) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasAnyNavMenuLayoutClass($classesString) {
        return $this->hasAnyClass($classesString, ['nav-menu-vertical', 'nav-menu-horizontal',]);
    }

    public function hasAnyMenuItemVisualClass($classesString) {
        return $this->hasAnyClass($classesString, ['menu-item-color', 'menu-item-background',]);
    }

    public function hasAnyClass($classesWhereToSearch, $classesToFind) {
        if (!$classesWhereToSearch) {
            return false;
        }

        if (!is_array($classesWhereToSearch)) {
            $classesWhereToSearch = explode(' ', $classesWhereToSearch);
        }

        foreach ($classesToFind as $classToFind) {
            if (in_array($classToFind, $classesWhereToSearch)) {
                return true;
            }
        }

        return false;
    }
}
