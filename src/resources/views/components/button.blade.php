@if ($as == 'link')
<a
    href="{{ $href }}"
    @if ($as == 'delete')
    data-role="button-delete"
    @endif
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</a>
@elseif ($as == 'delete')
<button
    data-url="{{ $url }}"
    data-redirect="{{ $redirect }}"
    data-role="button-delete"
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</button>
@else
<button
    @if ($menu)
    data-dropdown-menu="{{ $menu }}"
    @endif
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</button>
@endif