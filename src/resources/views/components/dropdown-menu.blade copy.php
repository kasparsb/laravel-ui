@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    class="floating-container"

    data-dropdown-menu-name="{{ $name }}"
    data-position-at="{{ $positionAt }}"
    data-position-x="{{ $x }}"
    data-position-y="{{ $y }}"

    data-side="{{ $side }}"
    data-align="{{ $align }}"

    tabIndex="{{ $tabIndex }}"
    @if ($hidden)
    hidden
    @endif
    >
    <div
        {{ $attributes->class([
            'dropdown-menu',
            'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
        ]) }}
        >
        {{ $slot }}
    </div>
    <span tabindex="0" data-dropdown-menu-focus-trap></span>
</div>