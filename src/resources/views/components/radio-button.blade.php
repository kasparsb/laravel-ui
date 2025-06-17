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
<button
    {{ $attributesForContainer->class([
        'button-radio',
    ]) }}

    data-role="radio-button"

    @disabled($disabled)
    >

    <span data-role="radio-check-visual"></span>
    <div data-radio-label>
        {{ $slot }}
    </div>

    <input
            {{ $attributesForInputField }}
            type="radio"
            name="{{ $name }}"
            value="{{ $value }}"
            @disabled($disabled)
            @checked($selected) />

</button>