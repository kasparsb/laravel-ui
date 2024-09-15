@php
    $p = explode('.', $as);
    $as = $p[0];
    $subAction = count($p) > 1 ? $p[1] : '';

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
@endphp
<a
    {{ $attributes->class([
        'menu-item',
        'selected' => $selected ? true : false,
    ]) }}

    data-role="menuitem"

    @if ($name)
    name="{{ $name }}"
    @endif

    @if ($linkSource)
    data-link-source="{{ $linkSource }}"
    @endif

    @if ($redirectSource)
    data-redirect-source="{{ $redirectSource }}"
    @endif

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

    @if ($disabled)
    disabled="disabled"
    @endif
    >

    @if (isset($prefix) && !$prefix->isEmpty())
        {{ $prefix }}
    @endif

    @if (
           (isset($slot) && !$slot->isEmpty())
        || $label
    )
    <span data-menu-item-label>{{ $slot->isEmpty() ? $label : $slot }}</span>
    @endif
</a>