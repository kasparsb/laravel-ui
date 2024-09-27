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
    <x-ui::h-stack>
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
            menu="ui:timepicker-menu"
            menuPositionDir="right bottom"
            menuPositionAtDir="left bottom"
            />
    </x-ui::h-stack>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    <input
        data-field-date-time-input
        {{ $attributesForInputField }}
        type="hidden"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled)
        />
</div>

<x-ui::time-picker-menu />