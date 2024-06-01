<div
    {{ $attributes->class(['form-field field-textarea']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <textarea
        name="{{ $name }}"
        placeholder="{{ $placeholder }}"
        @disabled($disabled)
        >{{ $value }}</textarea>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $error }}</p>
</div>