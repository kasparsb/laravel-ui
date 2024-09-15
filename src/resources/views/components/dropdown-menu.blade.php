@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    {{ $attributes->class([
        'dropdown-menu',
        'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
    ]) }}
    data-dropdown-menu-name="{{ $name }}"
    data-side="{{ $side }}"
    data-align="{{ $align }}"
    tabIndex="{{ $tabIndex }}"
    @if ($hidden)
    hidden
    @endif
    >
    {{ $slot }}

    <span tabindex="0" data-dropdown-menu-focus-trap></span>
</div>