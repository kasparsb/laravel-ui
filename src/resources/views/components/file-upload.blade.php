<div
    {{ $attributes->class([
        'file-upload',
        'has-single-file' => !$multiple,
        'has-multiple-files' => $multiple,
    ]) }}
    data-link="{{ $link }}"
    data-state="{{ $state }}"
    data-container="file-upload"
    data-value-field="{{ $valueField }}"
    @if ($previewImage)
    data-preview-image
    @endif
    @if ($multiple)
    data-multiple
    @endif
    @if ($files)
    data-has-files
    @endif
    >

    <x-ui::v-stack>
        <x-ui::v-stack data-r="files">
            @if ($files)
                @foreach ($files as $file)
                <x-ui::file-upload-single-file
                    :name="$name"
                    :removable="true"
                    :downloadable="true"
                    :model="$file"
                    :valueField="$valueField"
                />
                @endforeach
            @endif
        </x-ui::v-stack>

        <x-ui::file-picker
            data-r="file-picker"
            :removable="true"
            :multiple="$multiple"
            :label="$filePickerLabel"
            />

    </x-ui::v-stack>

    <x-ui::file-upload-single-file
        :name="$name"
        :previewImage="$previewImage"
        :removable="true"
        data-r="singleFileTemplate" />
</div>