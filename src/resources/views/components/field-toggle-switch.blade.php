<div
    {{ $attributes->class(['field-toggle-switch']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <div>
        <h4>{{ $label }}</h4>
        <p data-role="description">{{ $description }}</p>
        <p data-role="error">{{ $errorMessage }}</p>
    </div>
    <x-ui::toggle-switch
        :name="$name"
        :checked="$checked"
        :on-change="$onChange" />
</div>