<div {{ $attributes->class(['form-field field-date']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <input
        autocomplete="off"
        type="text"
        name="{{ $name }}"
        value="{{ $value }}"
        placeholder="{{ $placeholder }}"
        @if ($stateUrl)
        data-state-url="{{ $stateUrl }}"
        @endif
        />
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>