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
        'field-textarea',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div>
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif
        <textarea
            {{ $attributesForInputField }}
            name="{{ $name }}"
            placeholder="{{ $placeholder }}"
            @disabled($disabled)
            >{{ $value }}</textarea>
        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>