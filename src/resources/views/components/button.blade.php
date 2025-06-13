@inject('helpers', 'Kasparsb\Ui\Helpers')

@php

    $defaultAttributes = [];
    if ($as != 'link') {
        $defaultAttributes['type'] = 'button';
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

    /**
     * Sākumā bija domāts, ka delimiter būs . bet tad sapratu, ka labāk būs :
     * TODO Tāpēc šeit vēl pārbaudām vai ir . bet šis ir jāvāc ārā
     */
    $subActionDelimiterPos = strpos($as, ':');
    if ($subActionDelimiterPos === false) {
        $subActionDelimiterPos = strpos($as, '.');
    }
    if ($subActionDelimiterPos === false) {
        $p = [$as];
    }
    else {
        $p = [
            substr($as, 0, $subActionDelimiterPos),
            substr($as, $subActionDelimiterPos+1),
        ];
    }
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
    @if ($asTarget)
    data-button-as-target="{{ $asTarget }}"
    @endif

    @if ($replaceHtml)
    data-replace-html="{{ is_bool($replaceHtml) ? '' : $replaceHtml }}"
    @endif
    @if ($replaceHtmlTarget)
    data-replace-html-target="{{ $replaceHtmlTarget }}"
    @endif

    @if ($disabled)
    disabled="disabled"
    @endif

    @if ($menu)
    {{--
    data-dropdown-menu-position-at nozīmē, ka pozicionēsies pret button elementu
    var arī likt query selector
    ja nebūs attribūta vispār, tad ņems no paša DropdownMenu elementa
    --}}

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

    data-dropdown-menu-trigger="{{ $menu }}"
    data-dropdown-menu-show="{{ $menuShow }}"
        @if ($menuFocus)
        data-dropdown-menu-focus="{{ is_bool($menuFocus) ? '' : $menuFocus }}"
        @endif
        @if ($menuResetForm)
        data-dropdown-menu-reset-form
        @endif
    @endif

    @if (!(is_bool($menuHide) && !$menuHide))
    data-dropdown-menu-hide="{{ $menuHide }}"
    @endif

    @if ($table)
    data-table="{{ $table }}"
    @endif

    @if ($linkSource)
    data-link-source="{{ $linkSource }}"
    @endif

    @if ($redirectSource)
    data-redirect-source="{{ $redirectSource }}"
    @endif

    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif

    @if (is_bool($tabindex) && !$tabindex)
    tabindex="-1"
    @endif

    {{
        $attributes
            ->class([
                'button-'.$variant
            ])
            ->merge($defaultAttributes)
    }}
    >
    <x-ui::spinner />
    {{ $slot }}
</{{ $tag }}>