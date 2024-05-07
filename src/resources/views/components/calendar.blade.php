<div
    {{ $attributes->class(['calendar', 'size-'.$size]) }}
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
    @if ($onDateSelect)
    data-on-date-select="{{ $onDateSelect }}"
    @endif

    data-is-calendar
>
    <input
        type="hidden"
        data-role="date"
        @if ($name)
        name="{{ $name }}"
        @endif
        value="{{ $value }}" />

    @if ($defaultDateState)
    <script data-role="default-date-state" type="application/json">@json($defaultDateState)</script>
    @endif

    @if ($state)
    <script data-role="state" type="application/json">@json($state)</script>
    @endif
</div>