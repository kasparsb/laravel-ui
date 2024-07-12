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
        @if ($empty)
        <div
            class="menu-item"
            data-r="option"
            data-value=""
            {{ !$value ? 'data-checked' : '' }}
            >{{ is_bool($empty) ? '' : $empty }}</div>
        @endif

        @if (isset($slot) && !$slot->isEmpty())
        {{ $slot }}
        @elseif (is_iterable($options))
            @foreach ($options as $optionValue => $html)
            <div
                class="menu-item"
                data-r="option"
                data-value="{{ $optionValue }}"
                {{ $value == $optionValue ? 'data-checked' : '' }}
                >{{ $html }}</div>
            @endforeach
        @endif
    </div>
</div>