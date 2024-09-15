<a
    {{ $attributes->class([
        'menu-item',
    ]) }}
    href="{{ $link }}"
    @if ($selected)
    data-checked
    @endif
    >
    @if (isset($prefix) && !$prefix->isEmpty())
        {{ $prefix }}
    @endif

    @if (
           (isset($slot) && !$slot->isEmpty())
        || $label
    )
    <span data-menu-item-label>{{ $slot->isEmpty() ? $label : $slot }}</span>
    @endif
</a>