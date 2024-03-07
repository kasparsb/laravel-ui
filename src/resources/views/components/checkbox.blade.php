<label {{ $attributes->class(['checkbox']) }}>
    <span>
        <input type="checkbox" name="{{ $name }}" @checked($checked) value="1" />
        <svg>
            <use xlink:href="#checkbox-checked"></use>
        </svg>
    </span>
    {{ $label }}
</label>