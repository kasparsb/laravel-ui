<div
    {{ $attributes->class(['form-field field-select']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div class="select-placeholder" data-is-container="">
        <span data-r="placeholder"></span>
        <svg>
            <use xlink:href="#select-trigger"></use>
        </svg>
        <select
            name="{{ $name }}"
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