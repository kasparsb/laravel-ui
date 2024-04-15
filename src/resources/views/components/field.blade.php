<div {{ $attributes->class(['form-field']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <input
        type="{{ $type }}"
        name="{{ $name }}"
        value="{{ $value }}"
        placeholder="{{ $placeholder }}"
        @disabled($disabled)
        />
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>