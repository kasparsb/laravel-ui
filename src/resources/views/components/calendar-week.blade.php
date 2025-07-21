<x-ui::v-stack
    {{ $attributes->class([
        'calendar-week',
        'gap-1'
    ]) }}

    {{-- šajā elementā data picker (vecais FieldDate) meklē json config --}}
    data-date-picker-triggr-el-container
    >

    <span class="t-3.5">June, 2025</span>

    <x-ui::h-stack>

        <div
            class="h-stretch"
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

            data-calendar-view="week"
            data-calendar-week-count="1"

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

        <x-ui::button-ghost
            data-field-date-calendar-listener-name="calendar-week-data-picker"
            menu="field-date-calendar"
            menu-position-dir="left bottom"
            menu-position-at-dir="right bottom"
            class="icon">
            <x-tabler-calendar />
        </x-ui::button-ghost>

    </x-ui::h-stack>
</x-ui::v-stack>