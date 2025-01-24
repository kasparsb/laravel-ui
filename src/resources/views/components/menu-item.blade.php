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

    $menuItemTagName = 'a';
    if (!$link) {
        $menuItemTagName = 'button';
    }

    // Vai ir norādīts menu label, kas arī ir galvenais slot
    if (is_null($hasMenuLabel)) {
        $hasMenuLabel = isset($slot) && !$slot->isEmpty();
    }
@endphp
<{{ $menuItemTagName }}
    {{ $attributes->class([
        'menu-item',
    ]) }}

    data-role="menuitem"

    @if ($selected)
    data-checked
    @endif

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

    @if ($replaceHtml)
    data-replace-html="{{ is_bool($replaceHtml) ? '' : $replaceHtml }}"
    @endif
    @if ($replaceHtmlTarget)
    data-replace-html-target="{{ $replaceHtmlTarget }}"
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

    @if (!(is_bool($menuPositionAt) && !$menuPositionAt))
    data-dropdown-menu-position-at="{{ $menuPositionAt }}"
    @endif
    @if (!(is_bool($menuPositionAtDir) && !$menuPositionAtDir))
    data-dropdown-menu-position-at-dir="{{ $menuPositionAtDir }}"
    @endif

    @if (!(is_bool($menuPositionX) && !$menuPositionX))
    data-dropdown-menu-position-x="{{ $menuPositionX }}"
    @endif
    @if (!(is_bool($menuPositionY) && !$menuPositionY))
    data-dropdown-menu-position-y="{{ $menuPositionY }}"
    @endif
    @if (!(is_bool($menuPositionDir) && !$menuPositionDir))
    data-dropdown-menu-position-dir="{{ $menuPositionDir }}"
    @endif
    @if (!(is_bool($menuPositionXOffset) && !$menuPositionXOffset))
    data-dropdown-menu-position-x-offset="{{ $menuPositionXOffset }}"
    @endif
    @if (!(is_bool($menuPositionYOffset) && !$menuPositionYOffset))
    data-dropdown-menu-position-y-offset="{{ $menuPositionYOffset }}"
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

    @if ($hasMenuLabel)
    data-has-label
    @endif
    >

    @if (isset($prefix) && !$prefix->isEmpty())
        {{ $prefix }}
    @endif

    @if ($hasMenuLabel)
        <span data-menu-item-label>{{ $slot }}</span>

        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    @endif
</{{ $menuItemTagName }}>