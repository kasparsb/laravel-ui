@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@php
    // without data-* attributes
    $attributesForContainer = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) != 'data-';
    });
    // only data-* attributes
    $attributesForInputField = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) == 'data-';
    });

    $hasSufix = isset($sufix) && !$sufix->isEmpty();
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-date',
        'input-value-preview',
        'has-prefix',
        'has-sufix' => $hasSufix,
    ]) }}
    @if (!$value)
    data-is-empty
    @endif
    data-placeholder="{{ $placeholder }}"
    data-state="{{ $hasError ? 'error' : '' }}"
    tabindex="0"

    {{-- šajā elementā data picker (vecais FieldDate) meklē json config --}}
    data-date-picker-triggr-el-container
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div
        data-dropdown-menu-trigger="field-date-calendar"
        data-dropdown-menu-show="onfocusin"
        data-dropdown-menu-hide="_auto"
        {{--
            target-el vajadzīgs, lai menu atvēršanas click notiktu arī uz prefix un sufix
            bet tālāk jau vajag, lai tiek padots input elements, jo no tā tiks ņemta vērtība
            priekš dropdown un attiecīgi arī atgriezta uz to pašu input
        --}}
        data-dropdown-menu-target-el="child:input"
        data-dropdown-menu-position-at
        data-dropdown-menu-position-at-dir="left bottom"
        data-dropdown-menu-position-dir="right bottom"
        data-dropdown-menu-position-y-offset="4"
        >
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @else
            <svg width="24" height="24" viewBox="0 0 24 24" data-defautl-calendar-icon>
                <use xlink:href="#ui-icon-calendar"></use>
            </svg>
        @endif

        <div data-input-value-preview-placeholder>{{ $value ? '' : $placeholder }}</div>

        <input
        {{ $attributesForInputField }}
            autocomplete="off"
            type="hidden"
            @if ($name)
            name="{{ $name }}"
            @endif
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
            @if ($stateUrl)
            data-state-url="{{ $stateUrl }}"
            @endif
            @if ($minDate)
            data-min-date="{{ $minDate }}"
            @endif
            @if ($maxDate)
            data-max-date="{{ $maxDate }}"
            @endif

            {{-- Pazīme, ka šeit vajag uzlikt izvēlētos datumu --}}
            data-date-picker-set-selected-date
            @disabled($disabled)
            />

        @if ($clearable)
            <x-ui::button-ghost class="icon" data-dropdown-menu-trigger-ignore data-button-clear>
                <svg width="24" height="24" viewBox="0 0 24 24" data-defautl-calendar-icon>
                    <use xlink:href="#ui-icon-x"></use>
                </svg>
            </x-ui::button-ghost>
        @elseif (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    @if ($defaultDateState)
    <script data-role="default-date-state" type="application/json">@json($defaultDateState)</script>
    @endif

    @if ($state)
    <script data-role="state" type="application/json">@json($state)</script>
    @endif
</div>

@if (!$stateManager->isFieldDateCalendarMenu)
@php
    $stateManager->isFieldDateCalendarMenu = true;
@endphp
<x-ui::dropdown-menu name="field-date-calendar">
    <div class="menu-content">
        <div class="calendar size-8" data-field-date-calendar-container></div>
    </div>
</x-ui::dropdown-menu>
@endif