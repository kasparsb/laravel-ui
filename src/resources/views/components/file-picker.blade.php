<div {{ $attributes->class(['file-picker']) }}>
    <x-ui::button-secondary>Select file to upload</x-ui::button-secondary>
    <input
        data-r="inputFile"
        type="file"
        value=""
        @if ($multiple)
        multiple
        @endif
        />
</div>