<div
    {{ $attributes->class(['tab-content']) }}
    data-role="tab-content"
    data-tab-name="{{ $tabName }}"
    @if ($selected)
    data-selected
    @endif
    @if ($disableInputs)
    data-disable-inputs
    @endif
    >
    {{ $slot }}
</div>