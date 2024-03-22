<a
    {{ $attributes->class(['menu-item', $selected ? 'selected' : '']) }}
    data-role="menuitem"
    @if ($linkSource)
    data-link-source="{{ $linkSource }}"
    @endif
    @if ($as == 'delete')
    data-url="{{ $link }}"
    data-redirect="{{ $redirect }}"
    data-buttondelete=""
    @endif
    @if ($redirectSource)
    data-redirect-source="{{ $redirectSource }}"
    @endif
    href="{{ $link }}"
    >{{ $slot->isEmpty() ? $label : $slot }}</a>