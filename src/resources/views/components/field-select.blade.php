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
        <select
            name="{{ $name }}"
            data-value="{{ $value }}"
            @disabled($disabled)
            >

            @if ($empty)
            <option value="" @selected(!$value)>{{ is_bool($empty) ? '' : $empty }}</option>
            @endif

            @if (isset($slot) && !$slot->isEmpty())
            {{ $slot }}
            @elseif (is_iterable($options))
                @foreach ($options as $optionValue => $html)
                <option value="{{ $optionValue }}" @selected($value == $optionValue)>{{ $html }}</option>
                @endforeach
            @endif
        </select>
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>