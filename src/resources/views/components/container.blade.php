<div
    {{ $attributes->class([
        'container' => true,
    ]) }}
    data-ui-js="Container"
    @if ($loadingStyle)
    data-loading-style="{{ $loadingStyle }}"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    {{ $slot }}
</div>
@php app('Kasparsb\\Ui\\View\\StateManager')->queueComponentScript('Container'); @endphp
