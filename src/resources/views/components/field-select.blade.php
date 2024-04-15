<div {{ $attributes->class(['form-field field-select']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div class="select-placeholder" data-is-container="">
        <span data-value-text=""></span>
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

            @if (!$slot->isEmpty())
            {{ $slot }}
            @elseif (is_iterable($options))
                @foreach ($options as $optionValue => $html)
                <option value="{{ $optionValue }}" @selected($value == $optionValue)>{{ $html }}</option>
                @endforeach
            @endif
        </select>
    </div>
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>