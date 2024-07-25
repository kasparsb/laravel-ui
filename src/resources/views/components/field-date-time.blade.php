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
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-date-time',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"

    @if ($defaultTime)
    data-default-time="{{ $defaultTime }}"
    @endif
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div>
        <x-ui::field-date
            class="w-36"
            :stateUrl="$stateUrl"
            :minDate="$minDate"
            :maxDate="$maxDate"
            :defaultDateState="$defaultDateState"
            :state="$state"
            :disabled="$disabled"

            :value="$valueDate"
            />

        <x-ui::field-increment
            class="w-36"
            format="time"
            min="00:00"
            max="24:00"
            step="60"
            :value="$valueTime"
            menu="timepicker"
            menuShow="onfocusin"
            menuPositionAt=".field-increment"
            />
    </div>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    <input
        {{ $attributesForInputField }}
        type="hidden"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled)
        />
</div>

@if (!$stateManager->isTimePickerMenu())
@php
    $stateManager->setIsTimePickerMenu();
@endphp
<x-ui::dropdown-menu name="timepicker" data-timepicker-menu>

    <x-ui::v-stack class="p-4">
        <x-ui::field-hours-minutes
            labelHours="Hours"
            labelMinutes="Minutes"
            data-r="hoursMinutes"
            />

        <x-ui::h-stack class="h-right">
            <x-ui::button data-r="apply">Apply</x-ui::button>
        </x-ui::h-stack>

        <x-ui::delimiter dir="horizontal" />

        <div class="grid gap-2">
            @for ($hour = 0; $hour < 24; $hour++)
            <x-ui::button-outline
                class="compact"
                data-r="predefinedhour"
                data-hours="{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}"
                data-minutes="00"
                data-value="{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}:00"
                >{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}:00</x-ui::button-outline>
            @endfor
        </div>
    </x-ui::v-stack>
</x-ui::dropdown-menu>
@endif