@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    class="floating-container"

    data-dropdown-menu-name="{{ $name }}"

    data-position-x="{{ $positionX }}"
    data-position-y="{{ $positionY }}"
    data-position-dir="{{ $positionDir }}"
    data-position-x-offset="{{ $positionXOffset }}"
    data-position-y-offset="{{ $positionYOffset }}"

    data-position-at-dir="{{ $positionAtDir }}"

    @if (!(is_bool($positionAt) && !$positionAt))
    data-position-at="{{ $positionAt }}"
    @endif

    @if ($hidden)
    hidden
    @endif
    >
    <div
        data-dropdown-menu-content-el
        @if (!(is_bool($tabIndex) && !$tabIndex))
        tabindex="{{ $tabIndex }}"
        @endif
        {{ $attributes->class([
            'dropdown-menu',
            'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
        ]) }}
        >
        {{ $slot }}
        <span tabindex="0" data-dropdown-menu-focus-trap></span>
    </div>
</div>