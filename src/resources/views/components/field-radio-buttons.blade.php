<div
    {{ $attributes->class(['field-radio-buttons']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <x-ui::radio-buttons
        :name="$name"
        :value="$value"
        :buttonClass="$buttonClass"
        :buttonClassSelected="$buttonClassSelected"
        >
        {{ $slot }}
    </x-ui::radio-buttons>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>