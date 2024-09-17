@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    class="floating-container"

    data-dropdown-menu-name="{{ $name }}"

    data-position-x="{{ $positionX }}"
    data-position-y="{{ $positionY }}"
    data-position-dir="{{ $positionDir }}"
    data-position-x-offset="{{ $positionXOffset }}"
    data-position-y-offset="{{ $positionYOffset }}"

    @if (!(is_bool($positionAt) && !$positionAt))
    data-position-at="{{ $positionAt }}"
    @endif
    data-position-at-dir="{{ $positionAtDir }}"

    tabIndex="{{ $tabIndex }}"
    @if ($hidden)
    hidden
    @endif
    >
    <div
        {{ $attributes }}
        >
        {{ $slot }}
    </div>
    <span tabindex="0" data-dropdown-menu-focus-trap></span>
</div>