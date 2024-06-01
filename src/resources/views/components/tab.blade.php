@if ($as == 'link')
<a
    href="{{ $link }}"
    {{ $attributes->class([ 'tab', ]) }}
    data-role="tab"
    @if ($selected)
    data-selected
    @endif
    data-tab-name="{{ $name }}"
    >
    {{ $slot }}
</a>
@else
<button
    type="button"
    {{ $attributes->class([ 'tab', ]) }}
    data-role="tab"
    @if ($selected)
    data-selected
    @endif
    data-tab-name="{{ $name }}"
    >
    {{ $slot }}
</button>
@endif