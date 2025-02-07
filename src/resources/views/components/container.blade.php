<div
    {{ $attributes->class([
        'container' => true,
    ]) }}
    @if ($loadingStyle)
    data-loading-style="{{ $loadingStyle }}"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    {{ $slot }}
</div>