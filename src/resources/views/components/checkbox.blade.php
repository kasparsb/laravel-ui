<div
    {{ $attributes->class(['checkbox']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <label>
        <span>
            <input type="checkbox" name="{{ $name }}" @checked($checked) value="{{ $value }}" />
            <svg>
                <use xlink:href="#checkbox-checked"></use>
            </svg>
        </span>
        {{ $label }}
    </label>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>