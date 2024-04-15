<div {{ $attributes->class(['form-field field-textarea']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <textarea
        name="{{ $name }}"
        placeholder="{{ $placeholder }}"
        @disabled($disabled)
        >{{ $value }}</textarea>
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>