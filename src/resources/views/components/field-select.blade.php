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
        'form-field' => true,
        'field-select' => true,
    ]) }}
    @if (!$value)
    data-is-empty
    @endif
    data-state="{{ $hasError ? 'error' : '' }}"
    data-placeholder="{{ $placeholder }}"
    data-is-container=""
    data-options-list-id="{{ $optionsListId }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div class="select-placeholder">
        <div>
            <span data-r="placeholder">{{ $value ? '' : $placeholder }}</span>
        </div>
        <svg>
            <use xlink:href="#select-trigger"></use>
        </svg>
        <input
            {{ $attributesForInputField }}
            type="text"
            name="{{ $name }}"
            value="{{ $value }}"
            @disabled($disabled)
            />
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>

<div
    class="options b-c-200 hidden"
    data-is-container
    id="{{ $optionsListId }}"
    @if (!$searchable)
    tabindex="0"
    @endif
    >
    @if ($searchable)
    <x-ui::field-text placeholder="Search" data-r="fieldSearch" />
    <x-ui::delimiter dir="horizontal" />
    @endif
    @if (isset($slot) && !$slot->isEmpty())
        {{ $slot }}
    @elseif (is_iterable($options))
        @php
            $isEmptyChecked = !$value;
            // ja ir kāds no options, kurš atbilst vērtībai, tad empty checked būs false
            foreach ($options as $optionValue => $html) {
                if ($value == $optionValue) {
                    $isEmptyChecked = false;
                    break;
                }
            }
        @endphp
        @if ($empty)
            <x-ui::option value="" :checked="$isEmptyChecked">{{ is_bool($empty) ? '' : $empty }}</x-ui::option>
        @endif
        @foreach ($options as $optionValue => $html)
            <x-ui::option :value="$optionValue" :checked="$value == $optionValue">{{ $html }}</x-ui::option>
        @endforeach
    @endif
</div>