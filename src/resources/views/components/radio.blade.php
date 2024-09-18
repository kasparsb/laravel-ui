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
        'radio',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <label>
        <span>
            <input
                {{ $attributesForInputField }}
                type="radio"
                name="{{ $name }}" @checked($checked)
                value="{{ $value }}" />
            <svg width="40" height="40" viewBox="0 0 24 24">
                <use xlink:href="#radio-checked"></use>
            </svg>
        </span>
        {{ $label }}
    </label>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>