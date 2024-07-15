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
        'checkbox',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <label>
        <span>
            <input
                {{ $attributesForInputField }}
                type="checkbox"
                name="{{ $name }}" @checked($checked)
                value="{{ $value }}" />
            <svg>
                <use xlink:href="#checkbox-checked"></use>
            </svg>
        </span>
        {{ $label }}
    </label>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>