<a
    {{ $attributes->class([
        'menu-item',
        'selected' => $selected
    ]) }}
    href="{{ $link }}"
    >
    {{ $slot->isEmpty() ? $label : $slot }}
</a>