<div
    {{ $attributes->class(['file-picker']) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    <x-ui::button-secondary>{{ $label }}</x-ui::button-secondary>
    <input
        data-r="inputFile"
        type="file"
        value=""
        @if ($multiple)
        multiple
        @endif
        />
</div>