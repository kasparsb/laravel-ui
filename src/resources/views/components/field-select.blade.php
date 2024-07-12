<div
    {{ $attributes->class([
        'form-field' => true,
        'field-select' => true,
    ]) }}
    @if (!$value)
    data-is-empty
    @endif
    data-state="{{ $hasError ? 'error' : '' }}"
    data-placeholder="{{ $placeholder }}"
    data-is-container=""
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
            type="text"
            name="{{ $name }}"
            data-r="fieldValue"
            data-value="{{ $value }}"
            @disabled($disabled)
            />
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>

    <div class="options b-c-200" data-r="options">
        @if (isset($slot) && !$slot->isEmpty())
            {{ $slot }}
        @elseif (is_iterable($options))
            @if ($empty)
                <x-ui::option value="" :checked="!$value">{{ is_bool($empty) ? '' : $empty }}</x-ui::option>
            @endif
            @foreach ($options as $optionValue => $html)
                <x-ui::option :value="$optionValue" :checked="$value == $optionValue">{{ $html }}</x-ui::option>
            @endforeach
        @endif
    </div>
</div>