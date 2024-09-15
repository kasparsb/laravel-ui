@php
    $p = explode('.', $as);
    $as = $p[0];
    $subAction = count($p) > 1 ? $p[1] : '';
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