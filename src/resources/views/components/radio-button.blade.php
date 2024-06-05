<button
    data-role="radio-button"
    {{ $attributes->class([
        $buttonClass => !$selected,
        $buttonClassSelected => $selected,
    ]) }}

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