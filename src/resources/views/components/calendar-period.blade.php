<div
    class="calendar is-period size-{{ $size }}"
    data-period="yes"
    @if ($stateUrl)
    data-state-url="{{ $stateUrl }}"
    @endif
    @if ($name)
    data-name="{{ $name }}"
    @endif
>
    <input
        type="hidden"
        data-role="from"
        @if ($nameFrom)
        name="{{ $nameFrom }}"
        @endif
        value="{{ $from }}" />
    <input
        type="hidden"
        data-role="till"
        @if ($nameTill)
        name="{{ $nameTill }}"
        @endif
        value="{{ $till }}" />
</div>