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
        'field-hours-minutes',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <x-ui::h-stack>
        <x-ui::field-increment
            :label="$labelHours"
            class="w-28"
            min="0"
            max="23"
            padLeft="0"
            padLeftLength="2"
            value="{{ $hours }}" />
        :
        <x-ui::field-increment
            :label="$labelMinutes"
            class="w-28"
            min="0"
            max="59"
            padLeft="0"
            padLeftLength="2"
            value="{{ $minutes }}" />
    </x-ui::h-stack>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    <input
        {{ $attributesForInputField }}
        type="hidden"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled) />
</div>