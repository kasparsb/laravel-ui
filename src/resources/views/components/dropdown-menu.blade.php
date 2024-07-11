@inject('helpers', 'Kasparsb\Ui\Helpers')
<div
    {{ $attributes->class([
        'dropdown-menu',
        'static' => $isStatic,
        'floating' => !$isStatic,
        'hidden' => !$isStatic,
        'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
    ]) }}
    data-dropdown-menu-name="{{ $name }}"
    data-side="{{ $side }}"
    data-align="{{ $align }}"
    >
    {{ $slot }}
</div>