<div
    {{ $attributes->class(['radio-buttons']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div>
        {{ $slot }}
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $error }}</p>
</div>