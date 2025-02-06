<div
    {{ $attributes->class([
    'container' => true,
    ]) }}
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    {{ $slot }}
</div>