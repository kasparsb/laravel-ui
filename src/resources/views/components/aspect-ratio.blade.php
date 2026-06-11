<div
    {{ $attributes->class([
        'aspect-ratio-container',
    ]) }}
    data-ui-js="AspectRatio"
    style="aspect-ratio:{{ $aspectRatio }}"
    >
    {{ $slot }}
</div>
@php app('Kasparsb\\Ui\\View\\StateManager')->queueComponentScript('AspectRatio'); @endphp
