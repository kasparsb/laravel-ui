<div
    {{ $attributes->class([
        'aspect-ratio-container',
    ]) }}
    data-ui-js="AspectRatio"
    style="aspect-ratio:{{ $aspectRatio }}"
    >
    {{ $slot }}
</div>
{!! app('Kasparsb\\Ui\\View\\StateManager')->queueComponentScript('AspectRatio') !!}
