<?php

namespace Kasparsb\Ui;

trait ComponentWithError
{
    /**
     * Set error from Laravel session shared errors
     * shared view variable $error are set by this middleware
     * Illuminate\View\Middleware\ShareErrorsFromSession
     */
    public function setError() {
        // If there is no defined $errors, than get it from view sahred variable
        if (!$this->errors) {
            $this->errors = view()->shared('errors');
        }

        if ($this->errors) {
            if ($this->errors->has($this->name)) {
                $this->errorMessage = $this->errors->first($this->name);
                $this->hasError = true;
            }
        }
    }
}
