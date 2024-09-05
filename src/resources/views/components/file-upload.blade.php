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
    @if ($preview)
    data-preview-image
    @endif
    @if ($multiple)
    data-multiple
    @endif
    @if ($canAdd)
    data-file-picker
    @endif
    @if (isset($emptyState))
    data-has-empty-state
    @endif
    >

    <x-ui::v-stack>
        <x-ui::v-stack data-r="files">
            @if ($files)
                @foreach ($files as $file)
                <x-ui::file-upload-single-file
                    :name="$name"
                    :canRemove="$canRemove"
                    :canDownload="$canDownload"
                    :preview="$preview"
                    :file="$file"
                    :valueField="$valueField"
                />
                @endforeach
            @endif
        </x-ui::v-stack>

        <x-ui::file-picker
            data-r="file-picker"
            :multiple="$multiple"
            :label="$filePickerLabel"
            />

    </x-ui::v-stack>

    <x-ui::file-upload-single-file
        :name="$name"
        :canRemove="$canRemove"
        :canDownload="$canDownload"
        :preview="$preview"
        :disabled="true"
        data-r="singleFileTemplate" />

    @if (isset($emptyState))
    <div data-file-upload-empty-state="">
        {{ $emptyState }}
    </div>
    @endif
</div>