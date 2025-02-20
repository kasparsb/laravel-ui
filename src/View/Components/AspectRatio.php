<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class AspectRatio extends Component
{
    public $paddingBottom;
    public $aspectRatio;

    public function __construct(
        public $ratio,
    )
    {
        $delimiters = [':', '/', 'x', '*'];
        foreach ($delimiters as $delimiter) {
            $p = explode($delimiter, $this->ratio);
            if (count($p) > 1) {
                $this->paddingBottom = (($p[1] / $p[0]) * 100).'%';
                $this->aspectRatio = $p[0].'/'.$p[1];
                break;
            }
        }
        if (!$this->paddingBottom) {
            throw new Exception('Aspect ration container invalid ratio value');
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.aspect-ratio');
    }
}
