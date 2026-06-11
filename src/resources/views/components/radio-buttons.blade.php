<div
    {{ $attributes->class([
        'radio-buttons'
    ]) }}
    @if ($dataAttributes)
    {{ $dataAttributes }}
    @endif
    data-ui-js="RadioButtons"
    data-is-container
    >
    {{ $slot }}
</div>
@php app('Kasparsb\\Ui\\View\\StateManager')->queueComponentScript('RadioButtons'); @endphp
