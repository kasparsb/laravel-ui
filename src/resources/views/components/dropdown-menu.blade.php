@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    {{ $attributes->class([
        'dropdown-menu',
        'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
    ]) }}
    data-dropdown-menu-name="{{ $name }}"
    data-side="{{ $side }}"
    data-align="{{ $align }}"
    hidden
    >
    {{ $slot }}
</div>