<div
    {{ $attributes->class([
        'aspect-ratio-container',
    ]) }}
    style="aspect-ratio:{{ $aspectRatio }}"
    >
    {{ $slot }}
</div>