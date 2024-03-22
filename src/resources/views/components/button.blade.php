@if ($as == 'link')
<a
    href="{{ $href }}"
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</a>
@elseif ($as == 'delete')
<button
    data-url="{{ $url }}"
    data-redirect="{{ $redirect }}"
    data-buttondelete
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