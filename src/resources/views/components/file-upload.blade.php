<div
    {{ $attributes->class([
        'file-upload',
        'has-single-file' => !$multiple,
        'has-multiple-files' => $multiple,
    ]) }}
    data-link="{{ $link }}"
    data-state="{{ $state }}"
    data-container="file-upload"
    @if ($previewImage)
    data-preview-image
    @endif
    @if ($multiple)
    data-multiple
    @endif
    >

    <div class="col-items">
        <x-ui::file-picker
            data-r="file-picker"
            :multiple="$multiple"
            :label="$filePickerLabel"
            />
        <div class="col-items" data-r="files"></div>
    </div>

    <x-ui::file-upload-single-file
        :name="$name"
        :previewImage="$previewImage"
        data-r="singleFileTemplate" />
</div>