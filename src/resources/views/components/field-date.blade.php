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
        'form-field field-date',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <input
    {{ $attributesForInputField }}
        autocomplete="off"
        type="text"
        name="{{ $name }}"
        value="{{ $value }}"
        placeholder="{{ $placeholder }}"
        @if ($stateUrl)
        data-state-url="{{ $stateUrl }}"
        @endif
        @if ($minDate)
        data-min-date="{{ $minDate }}"
        @endif
        @if ($maxDate)
        data-max-date="{{ $maxDate }}"
        @endif
        @disabled($disabled)
        />
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    @if ($defaultDateState)
    <script data-role="default-date-state" type="application/json">@json($defaultDateState)</script>
    @endif

    @if ($state)
    <script data-role="state" type="application/json">@json($state)</script>
    @endif
</div>