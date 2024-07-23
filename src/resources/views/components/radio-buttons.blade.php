<div
    {{ $attributes->class([
        'radio-buttons'
    ]) }}
    @if ($dataAttributes)
    {{ $dataAttributes }}
    @endif
    data-is-container
    >
    {{ $slot }}
</div>