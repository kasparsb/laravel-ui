@if ($as == 'link')
<a
    href="{{ $link }}"
    {{ $attributes->class([ 'tab', ]) }}
    data-role="tab"
    data-tab-name="{{ $name }}"
    @if ($selected)
    data-selected
    @endif
    @if ($disabled)
    disabled="disabled"
    @endif
    >
    {{ $slot }}
</a>
@elseif ($as == 'radio')
<button
    @if ($type)
    type="{{ $type }}"
    @endif
    {{ $attributes->class([ 'tab', ]) }}
    data-role="tab"
    data-tab-name="{{ $name }}"
    @if ($selected)
    data-selected
    @endif
    @if ($disabled)
    disabled="disabled"
    @endif
    >
    {{ $slot }}

    <input
        type="radio"
        name="{{ $tabsName }}"
        value="{{ $name }}"
        @if ($selected)
        checked="checked"
        @endif
        />
</button>
@else
<button
    @if ($type)
    type="{{ $type }}"
    @endif
    {{ $attributes->class([ 'tab', ]) }}
    data-role="tab"
    data-tab-name="{{ $name }}"
    @if ($selected)
    data-selected
    @endif
    @if ($disabled)
    disabled="disabled"
    @endif
    >
    {{ $slot }}
</button>
@endif