@php
    // without data-* attributes
    $attributesForContainer = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) != 'data-';
    });
    // only data-* attributes
    $dataAttributes = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) == 'data-';
    });
@endphp

<div
    {{ $attributesForContainer->class([
        'field-radio-buttons',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <x-ui::radio-buttons
        :dataAttributes="$dataAttributes"
        :name="$name"
        :value="$value"
        >
        {{ $slot }}
    </x-ui::radio-buttons>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>