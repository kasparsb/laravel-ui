<div
    class="calendar is-period size-{{ $size }}"
    data-period="yes"
    @if ($stateUrl)
    data-state-url="{{ $stateUrl }}"
    @endif
    @if ($name)
    data-name="{{ $name }}"
    @endif
    @if ($minDate)
    data-min-date="{{ $minDate }}"
    @endif
    @if ($maxDate)
    data-max-date="{{ $maxDate }}"
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

    @if ($defaultDateState)
    <script data-role="default-date-state" type="application/json">@json($defaultDateState)</script>
    @endif

    @if ($state)
    <script data-role="state" type="application/json">@json($state)</script>
    @endif
</div>