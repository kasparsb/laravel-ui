<button
    data-role="radio-button"
    @if ($buttonClass == $buttonClassSelected)
    {{ $attributes->class([
        $buttonClass,
    ]) }}
    @else
    {{ $attributes->class([
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
        data-r="radio"
        type="radio"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled)
        @checked($selected) />
</button>