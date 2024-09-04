<div
    {{ $attributes->class([
        'aspect-ratio-container',
    ]) }}
    style="padding-bottom:{{ $paddingBottom }}"
    >
    <div data-r="content">
        {{ $slot }}
    </div>
</div>