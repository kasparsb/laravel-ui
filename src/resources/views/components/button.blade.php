@inject('helpers', 'Kasparsb\Ui\Helpers')

@php
    // Ja ir menu open trigger
    if ($menu) {
        if (!in_array($menuHide, ['onclick.outside', 'onmouseout', 'onfocusout',])) {
            $menuHide = 'onclick.outside';
        }

        if (!in_array($menuShow, ['onclick', 'onhover',])) {
            $menuShow = 'onclick';
        }

        // Ja tukšs string
        if (is_string($menuFocus) && !$menuFocus) {
            $menuFocus = true;
        }
    }
    else {
        // menu hide bez menu trigger, tas nozīme, ka poga varēs aizvērt menu by name
        if (!is_null($menuHide)) {
            if (is_bool($menuHide)) {
                if ($menuHide) {
                    // pēc noklusējuma aizver container menu
                    $menuHide = '_container';
                }
            }
            else {
                $menuHide = $menuHide ? $menuHide : '_container';
            }
        }
    }

    if (substr($link, 0, 6) == 'model:' && $model) {
        $link = $helpers->getModelRoute($model, substr($link, 6));
    }

    if ($as == 'delete') {
        if ($redirect !== false) {
            // skip redirect vispār, jo manuāli atsēgts
        }
        // Ja nav uzsetots redirect un ir padots model tad uztaisām automātiski
        if (!$redirect && $model) {
            $redirect = $helpers->getModelRoute($model, 'index');
        }
    }

    /**
     * Loading var būt vairāki state
     * onsubmit - būs loading, kad notiks formas submit
     * onpost - būs loading, kad notiks post uz pogas link
     * ondelete - būs loading, kad notiks delete uz pogas
     * onclick - kad click, tad loading
     */

    // Ja ir loading state, tad ir disabled
    if ($loading === true) {
        $disabled = true;
    }

    $p = explode('.', $as);
    $as = $p[0];
    $subAction = count($p) > 1 ? $p[1] : '';

    $tag = $as == 'link' ? 'a' : 'button';

@endphp

<{{ $tag }}
    @if ($as == 'link')
    href="{{ $link }}"
    @else
        @if ($link)
        data-url="{{ $link }}"
        @endif
    @endif

    @if ($redirect)
    data-redirect="{{ $redirect }}"
    @endif

    @if ($as)
    data-button-{{ $as }}="{{ $subAction }}"
    @endif

    @if ($disabled)
    disabled="disabled"
    @endif

    @if ($menu)
    data-dropdown-menu-trigger="{{ $menu }}"
    data-dropdown-menu-show="{{ $menuShow }}"
        @if ($menuFocus)
        data-dropdown-menu-focus="{{ is_bool($menuFocus) ? '' : $menuFocus }}"
        @endif
        @if ($menuResetForm)
        data-dropdown-menu-reset-form
        @endif
    @endif

    @if ($menuHide)
    data-dropdown-menu-hide="{{ $menuHide }}"
    @endif

    @if ($table)
    data-table="{{ $table }}"
    @endif

    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif

    {{
        $attributes
            ->class(['button-'.$variant])
            ->merge(['type' => 'button'])
    }}
    >
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
    {{ $slot }}
</{{ $tag }}>