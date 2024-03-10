<div

    {{ $attributes->class(['calendar', 'size-'.$size]) }}

    @if ($stateUrl)
    data-state-url="{{ $stateUrl }}"
    @endif
    @if ($name)
    data-name="{{ $name }}"
    @endif
>

    <input
        type="hidden"
        data-role="date"
        @if ($name)
        name="{{ $name }}"
        @endif
        value="{{ $value }}" />

</div>