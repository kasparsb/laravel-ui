<div
    {{ $attributes->class([
        'fieldable',
    ]) }}
    >
    @if ($label)
        <label>&nbsp;</label>
    @endif

    <div>
        {{ $slot }}
    </div>
</div>