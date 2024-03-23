<div {{ $attributes->class(['form-field field-text']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <input
        type="text"
        name="{{ $name }}"
        value="{{ $value }}"
        placeholder="{{ $placeholder }}" />
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>