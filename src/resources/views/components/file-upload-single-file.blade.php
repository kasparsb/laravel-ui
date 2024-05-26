<div
    {{ $attributes->class(['file-upload-single-file']) }}
    data-file-type="{{ $fileType }}"
    data-state="{{ $state }}"
    data-container="file-upload-single-file"
    >
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
            <use xlink:href="#ui-icon-music"></use>
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
    <div>
        <x-ui::button-outline class="icon" data-r="button-remove">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#ui-icon-x"></use>
            </svg>
        </x-ui::button-outline>
    </div>

    <input type="hidden" name="{{ $name }}" value="" data-r="input" />

</div>
