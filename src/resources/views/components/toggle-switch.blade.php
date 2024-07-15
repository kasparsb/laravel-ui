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
        'toggle-switch',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <label>
        @if ($labelPosition == 'left')
            @if ($label)
            <span>{{ $label }}</span>
            @endif
        @endif
        <span>
            <input
                {{ $attributesForInputField }}
                type="checkbox"
                name="{{ $name }}" @checked($checked)
                value="1" />
        </span>

        @if ($labelPosition == 'right')
            @if ($label)
            <span>{{ $label }}</span>
            @endif
        @endif
    </label>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>