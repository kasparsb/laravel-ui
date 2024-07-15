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
    data-role="radio-button"
    @if ($buttonClass == $buttonClassSelected)
    {{ $attributesForContainer->class([
        $buttonClass,
    ]) }}
    @else
    {{ $attributesForContainer->class([
        $buttonClassSelected => $selected,
        $buttonClass => !$selected,
    ]) }}
    @endif

    data-class="{{ $buttonClass }}"
    data-class-selected="{{ $buttonClassSelected }}"

    @disabled($disabled)
    >
    {{ $slot }}
    <input
        {{ $attributesForInputField }}
        data-r="radio"
        type="radio"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled)
        @checked($selected) />
</button>