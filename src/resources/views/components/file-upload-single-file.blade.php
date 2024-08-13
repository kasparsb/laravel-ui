<div
    {{ $attributes->class([
        'file-upload-single-file',
    ]) }}
    data-container="file-upload-single-file"
    data-file-type="{{ $fileType }}"
    data-state="{{ $state }}"
    @if ($previewImage)
    data-preview-image
    @endif
    @if ($downloadable)
    data-downloadable
    @endif
    @if ($removable)
    data-removable
    @endif
    >

    <x-ui::aspect-ratio
        data-r="preview"
        ratio="1:1"
        class="image-contain"
        ></x-ui::aspect-ratio>

    <div data-r="controls">
        <div class="icon">
            <svg data-type="document" width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-document"></use>
            </svg>
            <svg data-type="image" width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-image"></use>
            </svg>
            <svg data-type="video" width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-video"></use>
            </svg>
            <svg data-type="audio" width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-audio"></use>
            </svg>
            <svg data-type="archive" width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-archive"></use>
            </svg>
        </div>
        <div>
            <x-ui::title class="t-3.5" data-r="fileName">
                @if ($fileName) {{ $fileName }} @else &nbsp; @endif
            </x-ui::title>
            <x-ui::title-description data-r="fileDescription">
                @if ($fileDescription) {{ $fileDescription }} @else &nbsp; @endif
            </x-ui::title-description>

            <x-ui::progress-bar progress="{{ $progress }}" data-r="progressBar" />

            <div class="failed-message" data-r="failedMessage">
                @if ($error) {{ $error }} @else &nbsp; @endif
            </div>
        </div>
        <x-ui::h-stack class="gap-0">

            <x-ui::button-link
                as="link"
                data-r="button-download"
                :link="$linkDownload"
                >Download</x-ui::button-link>

            <x-ui::button-outline
                class="icon"
                data-r="button-remove">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#ui-icon-x"></use>
                </svg>
            </x-ui::button-outline>

        </x-ui::h-stack>
    </div>

    <input type="hidden" name="{{ $name }}" value="{{ $value }}" data-r="input" />

</div>
