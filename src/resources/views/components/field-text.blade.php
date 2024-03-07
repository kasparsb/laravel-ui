<div {{ $attributes->class(['form-field']) }}>
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