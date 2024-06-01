<button
    {{ $attributes->class([
        'button-ghost',
    ]) }}
    @disabled($disabled)
    >
    {{ $slot }}

    <input
        type="radio"
        name="{{ $name }}"
        value="{{ $value }}"
        @disabled($disabled)
        @checked($selected) />
</button>