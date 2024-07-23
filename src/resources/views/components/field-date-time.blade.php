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
            />

        <x-ui::field-increment
            class="w-36"
            format="time"
            min="00:00"
            max="24:00"
            step="60"
            value="13:00"
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